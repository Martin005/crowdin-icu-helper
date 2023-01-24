const express = require("express");
const manifest = require("./manifest");
const { Organization } = require("./db");
const { default: axios } = require("axios");
const apiClient = require("./apiClient");

const jwt = require("jsonwebtoken");

const authorizeUser = (req, res, next) => {
  let decodedJwt = null;
  let authorizationHeader = req.header("Authorization");

  const token = authorizationHeader
    ? authorizationHeader.split(" ")[1]
    : req.query.jwtToken;

  if (req.query.jwtToken) {
    try {
      decodedJwt = jwt.verify(token, process.env.CLIENT_SECRET);
    } catch (error) {
      console.error(error);
      // can't decode or verify JWT
    }
  }

  res.locals.isAuthorized = decodedJwt && decodedJwt.sub;
  res.locals.jwt = decodedJwt || {};

  next();
};

const router = express.Router();

router.get("/", (req, res) =>
  res.render("index", { baseUrl: process.env.BASE_URL })
);

router.get("/manifest.json", (req, res) => res.json(manifest));

router.get("/editor-page/", authorizeUser, (req, res) =>
  res.render("editor-panel")
);

router.get("/user", authorizeUser, async (req, res) => {
  if (!res.locals.isAuthorized) {
    return res
      .status(403)
      .send({ error: { message: "User is not authorized" } });
  }

  const organization = await Organization.findOne({
    where: {
      domain: res.locals.jwt.domain,
      organizationId: res.locals.jwt.context.organization_id,
    },
  });

  if (!organization) {
    return res
      .status(404)
      .send({ error: { message: "Organization not found" } });
  }

  try {
    const client = await apiClient(organization);
    const response = await client.get("user");

    return res.status(200).json(response.data || {});
  } catch (e) {
    console.log(e);

    return res.status(500).send({
      error: {
        message: "Unknown error occurred",
      },
    });
  }
});

router.post("/installed", async (req, res) => {
  const oauthPayload = {
    grant_type: "authorization_code",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.body.code,
  };

  const token = await axios.post(process.env.AUTH_URL, oauthPayload);
  const params = {
    domain: req.body.domain,
    organizationId: req.body.organizationId,
    baseUrl: req.body.baseUrl,
    accessToken: token.data.access_token,
    accessTokenExpires:
      Math.round(new Date().getTime() / 1000) + token.data.expires_in,
    refreshToken: token.data.refresh_token,
  };

  const organization = await Organization.findOne({
    where: {
      domain: req.body.domain,
      organizationId: req.body.organizationId,
    },
  });

  if (!organization) {
    await Organization.create(params);
  } else {
    organization.update(params);
  }

  res.status(200).send();
});

router.post("/uninstall", (req, res) => {
  Organization.destroy({
    where: {
      domain: req.body.domain,
      organizationId: +req.body.organizationId,
    },
  });

  res.status(200).send();
});

module.exports = router;

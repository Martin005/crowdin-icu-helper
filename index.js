const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { sequelize } = require("./db");

process.env.NODE_ENV !== "production" && require("dotenv").config();

const router = require("./router");

const port = process.env.PORT || 5000;

const app = express();

app
  .set("view engine", "ejs")
  .set("views", path.join(__dirname, "resources/views"))
  .use(bodyParser.json({ limit: "50mb" }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "public")))
  .use(router);

sequelize
  .sync()
  .then(app.listen(port, () => console.log(`Listening on ${port}`)));

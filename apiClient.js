const { default: axios } = require("axios");

const getActiveAccessToken = async (organization) => {
  if (organization.accessTokenExpires > Math.round(new Date().getTime() / 1000)) {
    return organization.accessToken;
  }

  const oauthPayload = {
    grant_type: "refresh_token",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: organization.refreshToken
  };

  const response = await axios.post(process.env.AUTH_URL, oauthPayload);

  organization = await organization.update({
    accessToken: response.data.access_token,
    accessTokenExpires: Math.round(new Date().getTime() / 1000) + response.data.expires_in,
    refreshToken: response.data.refresh_token
  });

  return organization.accessToken;
};

module.exports = async (organization) => {
  const apiClient = axios.create({
    baseURL: `${ organization.baseUrl }/api/v2/`,
  });

  apiClient.interceptors.request.use(async (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${ await getActiveAccessToken(organization) }`,
    };

    return config;
  });

  return apiClient;
}

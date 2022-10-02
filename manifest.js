module.exports = {
  identifier: "icu-helper",
  name: "ICU Message Format Helper",
  baseUrl: process.env.BASE_URL,
  logo: "/logo.svg",
  authentication: {
    type: "authorization_code",
    clientId: process.env.CLIENT_ID,
  },
  events: {
    installed: "/installed",
    uninstall: "/uninstall",
  },
  scopes: ["project"],
  modules: {
    "editor-right-panel": [
      {
        key: "editor-panel",
        position: "right",
        name: "ICU Message Format Helper",
        modes: ["translate"],
        url: "/editor-page",
      },
    ],
  },
};

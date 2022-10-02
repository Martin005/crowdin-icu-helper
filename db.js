const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL,
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

sequelize
  .authenticate()
  .then(async () => {
console.log("Connection has been established successfully.");
  })
  .catch(err => {
console.error("Unable to connect to the database:", err);
  });

const Organization = sequelize.define("organization", {
  domain: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  organizationId: {
    type: Sequelize.INTEGER
},
  baseUrl: {
    type: Sequelize.TEXT
},
  accessToken: {
    type: Sequelize.TEXT
},
  accessTokenExpires: {
    type: Sequelize.INTEGER
},
  refreshToken: {
    type: Sequelize.TEXT
},
});

module.exports = {
  sequelize,
  Organization
}

require("dotenv").config();

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,
};

module.exports = config;

const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = require('../config');

const secretKey = config.TOKEN_SECRET || process.env.TOKEN_SECRET;
const expiresIn = config.EXPIRES_IN || process.env.EXPIRES_IN;

const createToken = (payload, tokenExpiry = expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiry });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message.includes('jwt expired'),
      decoded: null,
    };
  }
};

module.exports = {
  createToken,
  verifyToken,
};

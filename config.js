require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key-jwt',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nore',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY 
}
require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const decodeData = async (req, res, next) => {
      const token = req.header('auth-token');
      if(!token) {
            res.status(401).json({err: "Please authenticate using Valid Token!"});
      } 
      try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next()
      } catch(err) {
            res.status(401).json({err: "Please authenticate using Valid Token!"});
      }
}

module.exports = decodeData;
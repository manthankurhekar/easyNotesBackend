const User = require('../models/User');

// password size must be >= 6
// email must be unique
// name must be unique 
// check valid email 

const emailValidator = require('deep-email-validator');

const credentialCheck = async (req, res, next) => {
      
      const emailStatus = await emailValidator.validate(req.body.email);

      if(req.body.name.length === 0) {
            res.json({success: false, err: 'Name cannot be an empty field!'});
      } else if(req.body.password.length < 6) {
            res.json({success: false, err: 'Password size must be greater than 5!'});
      } else if(!emailStatus.valid) {
            res.json({success: false, err: 'Invalid Email!'});
      } else if(await User.findOne({name: req.body.name})) {
            res.json({success: false, err: 'Name already exists!'});
      } else if(await User.findOne({email: req.body.email})) {
            res.json({success: false, err: 'Email already exists!'});
      } else {
            next();
      }
      
}

module.exports = credentialCheck;
require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const decodeData = require('../middlewares/decodeData');

router.post('/createuser', require('../middlewares/credentialCheck'), async (req, res) => {
      try {
            const salt = await bcrypt.genSalt(10);
            const user = await User.insertMany([{
                  name: req.body.name, 
                  email: req.body.email, 
                  password: await bcrypt.hash(req.body.password, salt)
            }]);

            const data = {
                  user: {
                        id: user[0].id
                  }
            };

            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            console.log(authToken);            
            res.json({success: true, authToken: authToken});

      } catch(e) {
            res.json({success: false, err: ""});
            console.log("Some problem with model User");
      }
});

router.post('/login', async (req, res) => {
      try {
            const {email, password} = req.body;
            const user = await User.findOne({email: email});
            if(!user) {
                  res.json({success: false, err: "Please enter valid Credentials!"});
            } else {
                  const passCheck = await bcrypt.compare(password, user.password);
                  if(!passCheck) {
                        success = false;
                        res.json({success: false, err: "Please enter valid Credentials!"});
                  } else {
                        const data = {
                              user: {
                                    id: user.id
                              }
                        }
                        console.log(user.id);
                        const authToken = jwt.sign(data, process.env.JWT_SECRET);
                        res.json({success: true, authToken:  authToken});
                  }
            }
      } catch (err) {
            console.log("Error in login!");
            res.json({err: "Some error with the login!"});
      }
});

router.get('/getuser', decodeData, async (req, res) => {
      try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
      } catch(err) {
            console.log("Error in getuser");
            res.json({err: "Some error with the getuser!"});
      }
});

module.exports = router;
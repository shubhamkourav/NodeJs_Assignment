var express = require('express');
var router = express.Router();
var users = require('../models/users');
var jwt = require("jsonwebtoken");
var auth = require('../JWT-Authentication');
var config = require("../config")
var bcrypt = require('bcrypt-nodejs');

//for verify email
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/* POST create users.
fields:- email,first_name,last_name,password
*/
router.post('/create', async (req, res, next) => {
  try {

    if (req.body && !req.body.email || !emailRegexp.test(req.body.email)) {
      res.status(422).json({ success: false, message: "Invalid email address" });
    }
    else if (req.body && !req.body.password || !req.body.password.lenght > 5) {
      res.status(422).json({ success: false, message: "password must be 6 digit" });
    }
    var user = await users.findOne({ email: req.body.email })
    if (user) {
      res.status(422).json({ success: false, message: "Email address already exists" });
    }
    else {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
      user = new users(req.body);
      user.save(function (err, user) {
        if (err) {
          return res.json({
            message: "Error when creating user",
            success: false
          });
        }
        return res.json({
          message: "user created successfully.",
          success: true,
          data: user
        });

      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
});
/**
 * Login user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    if (req.body && !req.body.email || !emailRegexp.test(req.body.email)) {
      res.status(422).json({ success: false, message: "Invalid email address" });
    }
    else if (req.body && !req.body.password || !req.body.password.lenght > 5) {
      res.status(422).json({ success: false, message: "password must be 6 digit" });
    }
    var user = await users.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      var token = jwt.sign({ user }, config.secret, { expiresIn: '30 days' });
      res.status(200).json({ success: true, token, message: "Login successfully" })
    }
    else {
      res.status(422).json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
/**
 * Get all or one user
 */
router.get(['/', '/:id'], auth, async (req, res) => {
  try {
    if (req.params.id) {
      var user = await users.findOne({ _id: req.params.id });
      if (user) {
        res.status(200).json({ success: true, user })
      }
      else {
        res.status(200).json({ success: true, user })
      }
    }
    else {
      var user = await users.find();
      res.status(200).json({ success: true, user })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
/**
 * Update user
 */
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.params.id || req.params.email) {
      var user = await users.findByIdAndUpdate(req.params.id, req.body)
      if (user) {
        res.status(200).json({ success: true, user });
      }
      else {
        res.status(422).json({ success: false, message: "Unable to update this user" })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
/**
 * Delete user
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.params.id) {
      var user = await users.findByIdAndDelete(req.params.id)
      if (user) {
        res.status(422).json({ success: true, message: "Deleted" })
      }
      else {
        res.status(422).json({ success: false, message: "Unable to delete this user" })
      }
    }
    else {
      res.status(422).json({ success: false, message: "Unable to delete this user" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
/**
 * genrate token for fogot password
 */
router.get('forgot/:email', async (req, res) => {
  try {
    if (req.params.email) {
      var user = await users.findOne({ email: req.params.email });
      if (user) {
        // We have the mail
        //Create Otp 
        res.status(200).json({ success: true, message: 'Otp send on your mail' });
      }
      else {
        res.status(422).json({ success: false, message: "Email not found" })
      }
    }
    else {
      res.status(422).json({ success: false, message: "No Email Param found" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
/**
 * Reset password
 */
router.post('reset/', async (req, res) => {
  try {
    if (req.body && req.body.email && req.body.password) {
      var user = users.findOneAndUpdate({ email: req.params.email }, req.body)
      if (user) {
        res.status(200).json({ success: true, message: 'Password successfully reset' });
      }
      else{
        res.status(422).json({ success: false, message: "Unable to change password" })
      }
    }
    else {
      res.status(422).json({ success: false, message: "Invalid Request" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error.." })
  }
})
module.exports = router;

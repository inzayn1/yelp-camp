const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');
const users = require('../controllers/users');
const user = require('../models/user');



router.get('/register', users.renderRegister);

router.post('/register',catchAsync( users.register));


router.get('/login',users.renderLogin);

router.post(
  '/login',
  storeReturnTo,  // <- must be used here if not already globally applied
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  users.login
);


router.get('/logout',users.logout); 



module.exports = router;
const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer')
const {storage}= require('../cloudinary');
const upload = multer({ storage })

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn,  upload.array('image'),  validateCampground,catchAsync(campgrounds.createCampground));
 






router.get('/new',isLoggedIn, campgrounds.renderNewForm)




router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit',  isLoggedIn, isAuthor , catchAsync(campgrounds.renderEditForm))

router.put('/:id',isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router;
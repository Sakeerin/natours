/* eslint-disable prettier/prettier */
const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.isLonggedIn);
  
router.get('/', bookingController.createBookingCheckout , authController.isLonggedIn,viewController.getOverview);
  
router.get('/tour/:slug', authController.isLonggedIn, viewController.getTour);

router.get('/login', authController.isLonggedIn, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router(); // สร้าง router object

// router.param('id', tourController.checkID);

// POST /tour/234vnds40/trviews
// GET /tour/234vnds40/trviews
// GET /tour/234vnds40/trviews/0887hsdf

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router.use('/:tourId/reviews', reviewRouter);

// eslint-disable-next-line prettier/prettier
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin','lead-guide', 'guide') ,tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTour)
  .post(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin','lead-guide'), tourController.uploadTourImages, tourController.resizeTourImages ,tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin','lead-guide') , tourController.deleteTour);



module.exports = router;

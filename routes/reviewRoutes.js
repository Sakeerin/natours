/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/234vnds40/trviews
// GET /tour/234vnds40/trviews
// POST /trviews

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.setTourUserIds ,reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReviw)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
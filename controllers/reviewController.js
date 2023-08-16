/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

// exports.getAllReviews = catchAsync(async(req, res, next) => {
//     let filter = {};
//     if(req.params.tourId) filter = {tour: req.params.tourId};
//     const reviews = await Review.find(filter);

//     if(!reviews){
//         return next(new AppError(`No review found`,404));
//       }
  
//       res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//           reviews: reviews,
//         },
//       });
// });


exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async(req, res, next) => {
//     // Allow nested routes
//   if(!req.body.tour) req.body.tour = req.params.tourId;
//   if(!req.body.user) req.body.user = req.user.id;
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         // results: reviews.length,
//         data: {
//           review: newReview,
//         },
//       });
// });

// exports.getReviw = catchAsync(async (req, res, next) => {
//     // const tour = await Tour.findById(req.params.id).populate('guides');
//     const review = await Review.findById(req.params.id);
//     // Tour.findById(req.params.id) = Tour.findOne({_id: req.params.id});
  
//     if(!review){
//       return next(new AppError(`No tour review with that ID`,404));
//     }
  
//     res.status(200).json({
//       status: 'success',
//       // results: tours.length,
//       data: {
//         review: review,
//       },
//     });
// });

exports.getReviw = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
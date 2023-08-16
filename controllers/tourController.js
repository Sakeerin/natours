/* eslint-disable */
/* eslint-disable arrow-body-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
// eslint-disable-next-line import/no-useless-path-segments
const Tour = require('./../models/tourModel');
// eslint-disable-next-line import/no-useless-path-segments
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');
// eslint-disable-next-line import/order
// const { match } = require('assert');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is; ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')){
    // console.log('filter is working...');
    cb(null, true);
  }else{
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ 
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1},
  { name: 'images', maxCount: 3}
]);

// upload.single('image'); req.file
// upload.array('images', 5); req.files

exports.resizeTourImages = catchAsync(async(req, res, next) => {
  console.log(req.files);
  if(!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer).resize(2000,1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async(file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer).resize(2000,1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  console.log(req.body);

  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// class APIFeatures{
//   constructor(query, queryString){
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter(){
//     // 1A) Filtering 
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     const queryObj = {...this.queryString};
//     const excludedFields = ['page','sort','limit','fields'];
//     excludedFields.forEach(el => delete queryObj[el]);

//     // console.log(req.query, queryObj);

//     // 1B) Advanced filtering
//     let queryStr = JSON.stringify(queryObj);
//     // eslint-disable-next-line no-shadow
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//     // console.log(JSON.parse(queryStr));

//     this.query = this.query.find(JSON.parse(queryStr));
//     // let query = Tour.find(JSON.parse(queryStr));

//     return this;
//   }

//   sort(){
//     if(this.queryString.sort){
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       // console.log(sortBy);
//       this.query = this.query.sort(sortBy);
//       // query = query.sort(req.query.sort);
//       // sort('price',ratingsAverage);
//     }else{
//       this.query = this.query.sort('-createdAt');
//     }

//     return this;
//   }

//   limitFields(){
//     if(this.queryString.fields){
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     }else{
//       this.query = this.query.select('-__v');
//     }

//     return this;
//   }

//   paginate(){
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;
//     // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3, ...
//     this.query = this.query.skip(skip).limit(limit);

//     // if(this.queryString.page){
//     //   const numTours = await Tour.countDocuments();
//     //   if(skip >= numTours) throw new Error('This page does not exist');
//     // }

//     return this;
//   }
// }

exports.getAllTour = factory.getAll(Tour);

// exports.getAllTour = catchAsync(async (req, res, next) => {
  
//     console.log(req.query);
    // BUILD QUERY
    // 1A) Filtering 
    // const queryObj = {...req.query};
    // const excludedFields = ['page','sort','limit','fields'];
    // excludedFields.forEach(el => delete queryObj[el]);
    // // console.log(req.query, queryObj);
    // // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting 
    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // console.log(sortBy);
    //   query = query.sort(sortBy);
    //   // query = query.sort(req.query.sort);
    //   // sort('price',ratingsAverage);
    // }else{
    //   query = query.sort('-createdAt');
    // }


    // const query = Tour.find(queryObj);
    // { duration: { gte: '5' }, difficulty: 'easy' }
    // { duration: { $gte: '5' }, difficulty: 'easy' } 
    // gte, gt, lte, lt

    // 3) Field limiling
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // }else{
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3, ...
    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments();
    //   if(skip >= numTours) throw new Error('This page does not exist');
    // }

    // USE AWAIT
    // const tours = await Tour.find(queryObj);
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

   
    // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // console.log(req.params);
//   // const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);
//     // const tour = await Tour.findById(req.params.id).populate('guides');
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     // Tour.findById(req.params.id) = Tour.findOne({_id: req.params.id});

//     if(!tour){
//       return next(new AppError(`No tour found with that ID`,404));
//     }

//     res.status(200).json({
//       status: 'success',
//       // results: tours.length,
//       data: {
//         tour: tour,
//       },
//     });
// });


exports.createTour = factory.createOne(Tour)

// exports.createTour =  catchAsync(async (req, res, next) => {

//   const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tours: newTour,
//       },
//     });
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
//     new: true,
//     runValidators: true
//   });

//   if(!tour){
//     return next(new AppError(`No tour found with that ID`,404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour 
//     },
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if(!tour){
//     return next(new AppError(`No tour found with that ID`,404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) =>{
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 }}
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty'},
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity'},
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1}
    },
    // {
    //   $match: { _id: { $ne: 'EASY'}}
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats 
    },
  });

  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingsAverage: { $gte: 4.5 }}
  //     },
  //     {
  //       $group: {
  //         // _id: '$ratingsAverage',
  //         // _id: '$difficulty',
  //         _id: { $toUpper: '$difficulty'},
  //         numTours: { $sum: 1 },
  //         numRatings: { $sum: '$ratingsQuantity'},
  //         avgRating: { $avg: '$ratingsAverage' },
  //         avgPrice: { $avg: '$price' },
  //         minPrice: { $min: '$price' },
  //         maxPrice: { $max: '$price' }
  //       }
  //     },
  //     {
  //       $sort: { avgPrice: 1}
  //     },
  //     // {
  //     //   $match: { _id: { $ne: 'EASY'}}
  //     // }
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       stats 
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan 
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3962.2 : distance / 6378.1;

  if(!lat || !lng){
    next(new AppError('Please provide latitude and longitude in the format lat,lng.',400));
  }

  console.log(distance, lat, lng, unit);

  const tours = await Tour.find({ 
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]} 
  }});

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng){
    next(new AppError('Please provide latitude and longitude in the format lat,lng.',400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
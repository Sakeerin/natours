/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// const csp = require('express-csp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`)); // เรียกใช้งาน static file เช่น ไฟล์รูปภาพ ไฟล์ js ไฟล์ css เป็นต้น
app.use(express.static(path.join(__dirname, 'public'))); // เรียกใช้งาน static file เช่น ไฟล์รูปภาพ ไฟล์ js ไฟล์ css เป็นต้น

// 1) GLOBAL MIDDLEWARE
// Set security HTTP headers
// app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));
// csp.extend(app, {
//   policy: {
//     directives: {
//       'default-src': ['self'],
//       'style-src': ['self', 'unsafe-inline', 'https:'],
//       'font-src': ['self', 'https://fonts.gstatic.com'],
//       'script-src': [
//         'self',
//         'unsafe-inline',
//         'data',
//         'blob',
//         'https://js.stripe.com',
//         'https://*.mapbox.com',
//         'https://*.cloudflare.com/',
//         'https://bundle.js:8828',
//         'ws://localhost:56558/',
//       ],
//       'worker-src': [
//         'self',
//         'unsafe-inline',
//         'data:',
//         'blob:',
//         'https://*.stripe.com',
//         'https://*.mapbox.com',
//         'https://*.cloudflare.com/',
//         'https://bundle.js:*',
//         'ws://localhost:*/',
//       ],
//       'frame-src': [
//         'self',
//         'unsafe-inline',
//         'data:',
//         'blob:',
//         'https://*.stripe.com',
//         'https://*.mapbox.com',
//         'https://*.cloudflare.com/',
//         'https://bundle.js:*',
//         'ws://localhost:*/',
//       ],
//       'img-src': [
//         'self',
//         'unsafe-inline',
//         'data:',
//         'blob:',
//         'https://*.stripe.com',
//         'https://*.mapbox.com',
//         'https://*.cloudflare.com/',
//         'https://bundle.js:*',
//         'ws://localhost:*/',
//       ],
//       'connect-src': [
//         'self',
//         'unsafe-inline',
//         'data:',
//         'blob:',
//         'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
//         'https://*.stripe.com',
//         'https://*.mapbox.com',
//         'https://*.cloudflare.com/',
//         'https://bundle.js:*',
//         'ws://localhost:*/',
//       ],
//     },
//   },
// });

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
// app.use(express.json()); // แปลงข้อมูลที่มีรูปแบบ JSON String ให้อยู่ในรูป JSON Objext
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());
app.use(express.urlencoded({ extended : true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));



// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

// Test middleware 
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// app.get('/', (req,res) => {
//     res.status(200).json({message: 'Hello from server side!', app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id/', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

module.exports = app;

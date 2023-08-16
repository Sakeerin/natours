/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
const mongoose = require('mongoose');
// eslint-disable-next-line import/newline-after-import
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');


// eslint-disable-next-line no-unused-vars, prettier/prettier
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

// eslint-disable-next-line prettier/prettier
mongoose
// .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
// eslint-disable-next-line no-unused-vars
}).then(con => {
  // console.log(con.connections);
  console.log('DB connection successful')
})
// console.log(app.get('env'));
// console.log(process.env);



// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// });

// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('ERROR :', err);
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on porta ${port}...`);
});

process.on('unhandleRejection', err => {
  // console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});



// console.log(x);
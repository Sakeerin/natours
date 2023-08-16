/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line prettier/prettier
module.exports = fn => {
    return (req, res, next) => {
      // fn(req, res, next).catch(err => next(err));
      fn(req, res, next).catch(next);
    }
};
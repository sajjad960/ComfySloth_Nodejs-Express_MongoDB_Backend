const AppError = require("../utilies/AppError");


const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Dublicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

const handleJWTError = (err) => {
  const message = `Invalid token. Please log in again`
  return new AppError(message, 401)
}

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in agian.', 401)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went rong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (err.name === "CastError") {
      error = handleCastError(err);
    }
    if (error.code === 11000) error = handleDublicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(err)
    if(error.name === 'TokenExpiredError') error =  handleJWTExpiredError()
    sendErrorProd(error, res);
  }
};

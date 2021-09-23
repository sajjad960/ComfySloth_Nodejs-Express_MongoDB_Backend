const express = require("express");
const app = express();
const cors = require('cors');

// Routers
const productRouter = require("./routes/productRoutes");
const userRouter = require('./routes/userRoutes');

// Errors
const AppError = require("./utilies/AppError");
const globalErrorHandler = require("./controllers/errorController");

app.use(cors({
  credentials: 'include',
  origin: '*'
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});

//Routes
app.use("/api/v1/store-products", productRouter);
app.use('/api/v1/users', userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const mongoose = require("mongoose");
const Products = require("../models/productModel");
const AppError = require("../utilies/AppError");

exports.checkFields = async (req, res, next) => {
  req.query.fields =
    "name,price,images,colors,company,description,category,shipping";

  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  limitedFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.query.select("-__v");
    }
    return this;
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    // const features = new APIFeatures(
    //   Products.find(),
    //   req.query
    // ).limitedFields();

    // const products = await features.query;

    //Aggregation

    const products = await Products.aggregate([
      {
        $unwind: "$images",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          price: { $first: "$price" },
          image: { $first: "$images.url" },
          colors: { $first: "$colors" },
          company: { $first: "$company" },
          description: { $first: "$description" },
          category: { $first: "$category" },
          shipping: { $first: "$shipping" },
        },
      },
    ]);
    // SEND RESPONCE
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return next(new AppError("No products found with that ID", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

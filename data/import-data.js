const fs = require("fs");
const mongoose = require("mongoose");
let dotenv = require("dotenv");
const Products = require("../models/productModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection succesfully"));

// Read json file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/product-demo.json`, "utf-8")
);

//import data into db

const importData = async () => {
  try {
    await Products.create(products);
    console.log("data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from db

const deleteData = async () => {
  try {
    await Products.deleteMany();
    console.log("data successfully deleted");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// for execute this file run 
// node data/import-data.js --import
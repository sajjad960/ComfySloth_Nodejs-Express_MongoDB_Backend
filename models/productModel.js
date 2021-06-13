const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  stock: {
    type: Number,
    required: [true, "Product need to declare stock"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  shipping: Boolean,
  featured: Boolean,
  colors: [],
  category: String,
  images: [],
  reviews: Number,
  stars: Number,
  name: {
    type: String,
    required: [true, "A product must have a name"],
    unique: true,
    trim: true,
  },
  description: String,
  company: String,
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;

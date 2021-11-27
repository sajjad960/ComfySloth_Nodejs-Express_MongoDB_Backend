const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: `${__dirname}/config.env`});

const app = require("./app");

// Atlasian DB
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log("DB connection successful"));

// Local DB
//env variable not working here
mongoose.connect(process.env.LOCAL_DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => console.log("DB connection successful"))


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app running on the port ${port}`);
});

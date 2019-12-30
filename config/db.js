// connection for mongoDB in JS. separated for easability
const mongoose = require("mongoose");
const config = require("config");
//can use this to get any val from JSON file!
const db = config.get("mongoURI");

//TO CONNECT

//create asynchronos arrow function
// try do all these inside try/catch blocks
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB Connected..");
  } catch (err) {
    console.error(err.message);
    //Exit here if theres an error
    process.exit(1);
  }
};

module.exports = connectDB;

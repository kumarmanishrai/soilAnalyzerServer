// fieldMongoConnection.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const fieldMongoConnection = mongoose.createConnection(
  process.env.MONGO_URI_FIELD,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const DailyData = fieldMongoConnection.model(
  "daily_data",
  new mongoose.Schema({}, { strict: false }),
  "daily_data"
);
const MinuteData = fieldMongoConnection.model(
  "minute_data",
  new mongoose.Schema({}, { strict: false }),
  "minute_data"
);

fieldMongoConnection.on(
  "error",
  console.error.bind(console, "Couldn't connect to field MongoDB")
);
fieldMongoConnection.once("open", () => {
  console.log("Field MongoDB connected successfully");
});
module.exports = { DailyData, MinuteData };

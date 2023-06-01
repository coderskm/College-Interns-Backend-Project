require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const route = require("./routes/route.js");
const app = express();

app.use(express.static('./public'));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb is connected 💯✅"))
  .catch((err) => console.log(err));

app.use("/", route);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});

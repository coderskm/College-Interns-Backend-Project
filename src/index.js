const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const route = require("./routes/route.js");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://sumitkm:sumitkm@cluster0.drkvbvw.mongodb.net/group20Database"
  )
  .then(() => console.log("mongodb is connected 💯✅"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(3000, function () {
  console.log("Express app running on port " + 3000);
});

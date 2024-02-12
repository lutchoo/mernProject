const mongoose = require("mongoose");

mongoose
  .connect(process.env.URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("failled to connect to mongodb", err));

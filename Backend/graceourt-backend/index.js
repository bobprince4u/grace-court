const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

//routes
const authRouter = require("./routers/authRouter");
const propertyRoutes = require("./routers/propertyRoutes");
const bookingRoutes = require("./routers/bookingRoutes");
const testimonialRoutes = require("./routers/testimonialRoutes");
const messageRoutes = require("./routers/messageRoutes");

//initialize an instance of express app
const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//import routes
app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRoutes);
app.use("/api/properties/:id", propertyRoutes);
app.use("/api/properties/:id/images", propertyRoutes);
app.use("/api/properties/update/:id", propertyRoutes);
app.use("/api/searchProperties", propertyRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/testimonials/:id", testimonialRoutes);
app.use("/api/testimonials/:id/delete", testimonialRoutes);

app.use("/api/messages", messageRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

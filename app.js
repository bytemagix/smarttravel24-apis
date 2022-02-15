const express = require("express");
const formidable = require("express-formidable");

const PORT = process.env.PORT || 7000;
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/drivers");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payments");
const notificationsRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/messages");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Contorl-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});

app.use(formidable());
app.use("/auth", authRoutes);
app.use("/drivers", driverRoutes);
app.use("/admin", adminRoutes);
app.use("/booking", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/messages", messageRoutes);

app.listen(PORT);

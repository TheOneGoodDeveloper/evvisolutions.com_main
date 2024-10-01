// Node_modules
const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const AdminRoute = require("./Routes/Admin_routes.js");
const UserRoute = require("./Routes/User_routes.js");

const app = express();
const port = 3000;

app.use(express.json({ limit: "10mb" }));
// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors());

app.use("/blog_images", express.static(path.join(__dirname, "/blog_images")));

app.use(express.static(path.join(__dirname, "/dist")));

app.use("/admin", AdminRoute);
app.use("/", UserRoute);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});

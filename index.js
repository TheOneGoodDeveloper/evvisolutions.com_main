const express = require('express');
// const connectDatabase = require('./Model/db.js');
const contactSubmit = require('./Controller/Contact_controller.js');
const connection = require("./Model/db_Mysql.js")
const AdminRoute = require("./Routes/Admin_routes.js")
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json({limit: '10mb'}));
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/blog_images", express.static(path.join(__dirname, "/blog_images")));

app.use(express.static(path.join(__dirname, '/dist')));

app.use("/admin", AdminRoute);
app.post('/contact', contactSubmit);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
// connectDatabase();
// connection();

app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});

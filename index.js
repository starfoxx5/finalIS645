// Add required packages
const express = require("express");
const app = express();

require("dotenv").config();

// Set up EJS
app.set("view engine", "ejs");

// Add database package and connection string (can remove ssl)
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Start listener
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
  //res.send ("Hello world...");
  res.render("index");
});

app.get("/data", (req, res) => {
  //res.send ("Hello world...");
  const sql = "SELECT * FROM PRODUCT ORDER BY PROD_ID";
  pool.query(sql, [], (err, result) => {
    var message = "";
    var model = {};
    if (err) {
      // console.log("err is:", err);
      message = `Error - ${err.message}`;
    } else {
      // console.log("result.rows is: ", result);
      // console.log("result.rows is: ", result.rows);
      message = "success";
      model = result.rows;
    }
    res.render("data", {
        message: message,
        model : model
    });
  });
});

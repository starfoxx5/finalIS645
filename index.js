// Add required packages
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();
// require("dotenv").config();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Application folders
app.use(express.static("public"));

// Add database package and connection string (can remove ssl)
// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// Start listener
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
  //res.send ("Hello world...");
  res.render("index");
});

app.get("/sum", async (req, res) => {
  res.render("sum", {
    type: "get",
  });
});

app.get("/import", async (req, res) => {
  const totRecs = await dblib.getTotalRecords();
  res.render("import", {
    type: "get",
    totRecs: totRecs.totRecords,
  });
});

// POSTS

app.post("/sum", async (req, res) => {
  dblib
    .addNums(req.body)
    .then((result) => {
      if (result.trans === "success") {
        res.render("create", {
          type: "post",
          prod: req.body,
          error: "false",
        });
      } else {
        res.render("create", {
          type: "post",
          prod: req.body,
          error: `Unexpected Error: ${result.msg}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/import", upload.single("filename"), async (req, res) => {
  console.log("hi");
  console.log(req.file, req.body);

  if (!req.file) {
    //  if (!req.file || Object.keys(req.file).length === 0) {
    message = `Error: Import file not uploaded ${req.file}`;
    return res.json({
      message: message,
    });
  }
  //Read file line by line, inserting records
  const buffer = req.file.buffer;
  const lines = buffer.toString().split(/\r?\n/);

  var numFailed = 0;
  var numInserted = 0;
  var errorMessage = [];

  // lines.forEach(async (line) => {
  for (let line of lines) {
    product = line.split(",");
    //console.log(product);
    let result = await dblib.insertBook(product);
    // if (isbn === "Null" || published_date === "Null") {
    //   (isbn = null), (published_date = null);
    // }
    if (result.trans === "success") {
      numInserted++;
    } else {
      console.log(result);
      numFailed++;
      // errorMessage += `${result.msg} \r\n`;
      errorMessage.push(result.msg);
    }
  }
  // });
  //index.js establishes the data for the routes
  //dblib establishes the logic for the database
  const totRecs = await dblib.getTotalRecords();
  res.json({
    type: "post",
    numFailed: numFailed,
    numInserted: numInserted,
    errorMessage: errorMessage,
    totRecs: totRecs.totRecords,
    // totRecords: totRecords,
  });
});

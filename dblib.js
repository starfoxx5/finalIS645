// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getTotalRecords = () => {
  sql = "SELECT COUNT(*) FROM book";
  return pool
    .query(sql)
    .then((result) => {
      return {
        msg: "success",
        totRecords: result.rows[0].count,
      };
    })
    .catch((err) => {
      return {
        msg: `Error: ${err.message}`,
      };
    });
};

const insertBook = (book) => {
  // Will accept either a book array or book object
  if (book instanceof Array) {
    params = book;
  } else {
    params = Object.values(book);
  }

  console.log("params is: ", params);

  const sql = `INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date)
               VALUES ($1, $2, $3, $4, $5, $6)`;

  return pool
    .query(sql, params)
    .then((res) => {
      return {
        trans: "success",
        msg: `Book id ${params[0]} successfully inserted`,
      };
    })
    .catch((err) => {
      return {
        trans: "fail",
        msg: `Error on insert of book id ${params[0]}.  ${err.message}`,
      };
    });
};

// const sumNumbers = (sum) ={
//   var total = 0;
//   for (var i =0; i < arguments.length; i++){
//     var num = parseFloat(arguments[i])

//     if(isNaN(num) === false) {
//       total +=num
//     }
//   }
//   return total
// }

// Add this at the bottom
module.exports.insertBook = insertBook;
module.exports.getTotalRecords = getTotalRecords;
// module.exports.sumNumbers = sumNumbers;

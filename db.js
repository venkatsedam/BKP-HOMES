const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
    return;
  }
  console.log("DB Connected ✅");
});

module.exports = db;
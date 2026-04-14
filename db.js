const mysql = require("mysql2");

const db = mysql.createConnection(
  "mysql://root:KNrqCCCfiIXWwZkPQvfbqkyInsMIyuvm@monorail.proxy.rlwy.net:32967/railway"
);

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
    return;
  }
  console.log("DB Connected ✅");
});

module.exports = db;
const mysql = require("mysql2");

const db = mysql.createConnection({
  mysql://root:BdlwiiKvpgMurABDNDnSwvuKIVSWBmMq@monorail.proxy.rlwy.net:53487/railway
});

db.connect(err => {
  if (err) throw err;
  console.log("DB Connected");
});

module.exports = db;

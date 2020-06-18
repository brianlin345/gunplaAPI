var sql = require('sqlite3').verbose();
let db = new sql.Database('./gunplaData.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the gunpla database.');
});

module.exports = db;

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Get method with options for kit name and release data query strings
router.get("/", function(req, res) {
  var nameSearch = req.query.name;
  var dateSearch = req.query.date
  if (nameSearch) {
    var searchPattern = '%' + nameSearch + '%';
    var sql = "SELECT name, series, height, manufacturer, price, release FROM gunpla WHERE name LIKE ?";
    var params = [searchPattern];
    db.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({
        "results": rows.length,
        "data": rows});
    });
  } else if (dateSearch) {
    var searchPattern = '%' + dateSearch + '%';
    var sql = "SELECT name, series, height, manufacturer, price, release FROM gunpla WHERE release LIKE ?";
    var params = [searchPattern];
    db.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({
        "results": rows.length,
        "data": rows});
    });
  } else {
    var sql = "SELECT name, series, height, manufacturer, price, release FROM gunpla";
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      }
      res.json({
        "results": rows.length,
        "data": rows
      });
    });
  }
});

// Get method using numerical id endpoint
router.get("/:id", function(req, res) {
  var sql = "SELECT name, series, height, manufacturer, price, release FROM gunpla WHERE id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, rows) => {
    if (err) {
      throw err;
    }
    res.json({"data": rows});
  });
});

// Post method that creates a new entry with id auto-generated based on the number of existing entries
router.post("/", function(req, res) {
  var data = {
    "name": req.body.name,
    "series": req.body.series,
    "height": req.body.height,
    "manufacturer": req.body.manufacturer,
    "price": req.body.price,
    "release": req.body.release
  };
  var len = "SELECT COUNT(*) FROM gunpla";
  var lenParams = [];
  var tableLen = 0;
  db.get(len, lenParams, (err, rows) => {
    if (err) {
      throw err;
    }
    tableLen = rows["COUNT(*)"];
    var sql = "INSERT INTO gunpla VALUES (?,?,?,?,?,?,?)"
    var params = [tableLen, data.name, data.series, data.height, data.manufacturer, data.price, data.release];
    db.run(sql, params, (err) => {
      if (err) {
        throw err;
      }
      res.json({
        "data": data,
        "id": tableLen
      });
    });
  });
});

// Put method updating given entry by id in database
router.put("/:id", function(req, res){
  var data = {
    "name": req.body.name,
    "series": req.body.series,
    "height": req.body.height,
    "manufacturer": req.body.manufacturer,
    "price": req.body.price,
    "release": req.body.release
  };
  var sql = "UPDATE gunpla SET name = ?, series = ?, height = ?, manufacturer = ?, price = ?, release = ? WHERE id = ?";
  var params = [data.name, data.series, data.height, data.manufacturer, data.price, data.release, req.params.id];
  db.run(sql, params, (err) => {
    if (err) {
      throw err;
    }
    res.json({
      "data": data,
      "id": req.params.id
    });
  });
});

// Delete method that removes a given entry by id in database
router.delete("/:id", function(req, res) {
  var sql = "DELETE FROM gunpla WHERE id = ?";
  var params = [req.params.id];
  db.run(sql, params, (err) => {
    if (err) {
      throw err;
    }
    res.json({
      "deleted": req.params.id
    });
  });
});

module.exports = router;

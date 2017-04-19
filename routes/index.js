var express = require('express');
var router = express.Router();

var Database = require('better-sqlite3');

router.route('/get/:table')
  .get(function(req, res, next) {
    var db = new Database('data/tr1/SeradexTracker.sqlite', {});
    var rows = db.prepare('SELECT * FROM '+req.params.table).all();
    res.send(rows);
  });

router.route('/tr')
  .post(function(req, res, next) {
    var dbPath = req.body.path;
    var table = req.body.table;
    
    try {
      var db = new Database(dbPath, {});
      var rows = db.prepare('SELECT * FROM ' + table).all();
    } catch(error) {
      console.log('error');
      return next(error);
    }
    
    console.log('passed');
    res.send(rows);
  });
    
module.exports = router;
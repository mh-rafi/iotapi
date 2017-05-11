var express = require('express');
var router = express.Router();

var Database = require('better-sqlite3');

router.route('/get/:table')
  .get(function(req, res, next) {
    var db = new Database('data/SeradexTracker.sqlite', {});
    var rows = db.prepare('SELECT * FROM '+req.params.table).all();
    res.send(rows);
  });

router.route('/confirm/:table')
  .get(function(req, res, next) {
    var date = new Date();
    
    var table = req.params.table;
    var backupTable = table + '_backup_'+ date.toJSON().replace(/-|:|\./g, '_');
    
    var db = new Database('data/SeradexTracker.sqlite', {});
    var stmt = db.prepare('CREATE TABLE '+  backupTable +' AS SELECT * FROM '+ table);
    var result = stmt.run();
    
    // try {
    //   var stmt = db.prepare('CREATE TABLE '+  backupTable +' AS SELECT * FROM '+ table);
    // } catch(e) {
    //   console.log(e);
    // }
    
    // console.log(stmt);
    var stmtDel = db.prepare('DELETE FROM '+ table);
    stmtDel.run();
    
    console.log('-----');
    res.send({
      message: 'new backup table created',
      backupTable: backupTable
    });
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
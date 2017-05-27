var express = require('express');
var Database = require('better-sqlite3');
var path = require('path');
var fs = require('fs');


var router = express.Router();
var appDir = path.dirname(require.main.filename);

function tableExists(arr, tblName) {
 for(var i = 0; i < arr.length; i++) {
    var item = arr[i];
    
    if (item.tbl_name === tblName)
      return true;
 }
 return false;
}

function getDBPath(mainDB) {
  var result = mainDB.prepare('SELECT * FROM IoTConfig WHERE paramkey = "path"').all();
  if(result[0]) {
    console.log('Path exists in IoTConfig');
    return result[0].paramvalue;
  } else {
    console.log('Path not exists in IoTConfig');
    console.log('Falling back to default path');
    return null;
  }
}


// TEST Route
router.route('/setpath/')
  .get(function(req, res, next) {
    
    var path = req.query.path;
    
    if(!fs.existsSync(path)) {
      return res.status(404).send('Invalid DB path!');
    }
    
    // console.log(path);
    try {
      var defaultPath = appDir + '/data/SeradexTracker.sqlite';
      var db = new Database(defaultPath, {});
      var delStmt = db.prepare('DELETE FROM IoTConfig WHERE paramkey = "path"');
      delStmt.run();
      
      var stmt = db.prepare('INSERT INTO IoTConfig (paramkey, paramvalue) VALUES ("path", "'+ path +'")');
      stmt.run();
    } catch(e) {
      console.log(e);
      res.status(400).send(e.toString());
    }

    res.send('Success!');
  })

router.route('/data/:table')
  .get(function(req, res, next) {
    
    var defaultPath = appDir + '/data/SeradexTracker.sqlite';
    
    // console.log(path);
    try {
      var mainDB = new Database(defaultPath, {});
      var path = getDBPath(mainDB);
      var DB = path ? new Database(path) : mainDB;
      
      var rows = DB.prepare('SELECT * FROM ' + req.params.table).all();
    } catch(e) {
      console.log(e);
      res.status(400).send(e.toString());
    }
    
    res.send(rows);
  })
  .post(function(req, res, next) {
    
    var defaultPath = appDir + '/data/SeradexTracker.sqlite';
    
    var table = req.params.table;
    var rowToAdd = req.body;
    
    if(!rowToAdd)
      return res.status(400).send('row field is empty!');
    
    // CONSTRUCT COMMA SEPARATED COLUMN NAMES FOR SQL
    var columns = '';
    for(var item in rowToAdd) {
      columns += '$'+ item + ',';
    }
    columns = columns.substr(0, columns.length - 1);
    // console.log(columns);
    
    try {
      var mainDB = new Database(defaultPath, {});
      var path = getDBPath(mainDB);
      var DB = path ? new Database(path) : mainDB;
      
      var insertSTMT = DB.prepare('INSERT INTO '+ table +' VALUES ('+ columns +')');
      var insertResult = insertSTMT.run(rowToAdd);
    } catch(e) {
      console.log(e);
      res.status(400).send(e.toString());
    }
    
    res.send(insertResult);
  })
  .delete(function(req, res, next) {
    var defaultPath = appDir + '/data/SeradexTracker.sqlite';
    var table = req.params.table;
    var conditionKey = req.body.key;
    var conditionValue = req.body.value;
    
    try {
      var mainDB = new Database(defaultPath, {});
      var path = getDBPath(mainDB);
      var DB = path ? new Database(path) : mainDB;
      
      var deleteSTMT = DB.prepare('DELETE FROM '+ table +' WHERE '+ conditionKey + '="'+ conditionValue +'"');
      deleteSTMT.run();
    } catch (e) {
      console.log(e);
      res.status(400).send(e.toString());
    }
    
    res.send('Row has been deleted.');
  });


router.route('/confirm/:table')
  .get(function(req, res, next) {
    
    var defaultPath = appDir + '/data/SeradexTracker.sqlite';
    
    var table = req.params.table;
    var backupTable = table + '_backup';
    
    
    try {
      
      var mainDB = new Database(defaultPath, {});
      var DBpath = getDBPath(mainDB);
      var DB = DBpath ? new Database(DBpath) : mainDB;
      
      var deleteSTMT = DB.prepare('DELETE FROM '+ table);
      
      // GET ALL TABLES
      var allTablesSTMT = DB.prepare('SELECT * FROM sqlite_master WHERE type="table"');
      var allTables = allTablesSTMT.all();
      
      // CHECK BACKUP TABLE EXISTS 
      if (tableExists(allTables, backupTable)) {
        
        var appendSTMT = DB.prepare('INSERT INTO '+ backupTable +' SELECT * FROM '+ table);
        appendSTMT.run();
        deleteSTMT.run();
        // console.log('table exists.')
      } else {
        
        var creatCopySTMT = DB.prepare('CREATE TABLE '+ backupTable +' AS SELECT * FROM '+ table);
        var creatCopyResult = creatCopySTMT.run();
        deleteSTMT.run();
        // console.log('table is not exists.')
      }
    } catch (e) {
      console.log('Error!');
      console.log(e);
      res.status(400).send(e.toString());
    }
    
    res.send({
      message: 'Data is saved to table: '+ backupTable
    });
  });

router.route('/test')
  .get(function(req, res) {
    try {
      var db = new Database(appDir + '/data/SeradexTracker.sqlite', {});
      var stmt = db.prepare('SELECT * FROM sqlite_master WHERE type="table"');
      var result = stmt.all();
    } catch(e) {
      console.log('Error!');
      console.log(e);
    }
    
    console.log(result);
    res.json(result);
    
  });
  
module.exports = router;
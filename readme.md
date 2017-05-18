### GET api/data/table_name/?path=/home/pi/path/to/sqlitefile.sqlite
Returns all rows from table_name.

### POST api/data/table_name/?path=/home/pi/path/to/sqlitefile.sqlite
Insert row in table_name

    Sample requet body
    {
        "LoggerID": 10,
        "DeviceID": "0660AF02",
        "LogDateTime": "2016-08-17 13:48:57.115331",
        "Distance": 20
    }

### GET api/confirm/table_name/?path=/home/pi/path/to/sqlitefile.sqlite
Delete all values from table and create new table "table_name_backup".

NB: if path is not provide server will use /data/SeradexTracker.sqlite in project folder.
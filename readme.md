### Returns all rows from "table_name".
GET api/data/table_name/?path=/home/pi/path/to/sqlitefile.sqlite

### Insert row in "table_name"
POST api/data/table_name/?path=/home/pi/path/to/sqlitefile.sqlite

    Sample requet body
    {
        "LoggerID": 10,
        "DeviceID": "0660AF02",
        "LogDateTime": "2016-08-17 13:48:57.115331",
        "Distance": 20
    }

### Delete all values from "table_name" and create new table "table_name_backup".
GET api/confirm/table_name/?path=/home/pi/path/to/sqlitefile.sqlite

#### NB: Query parameter "path" is optional, default path is /data/SeradexTracker.sqlite in project folder.
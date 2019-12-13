/* Load modules */
let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
let db = new sqlite3.Database('./sqlite.db');

/* Init car and driver tables if they don't exist */
let init = function () {
    db.run("CREATE TABLE if not exists userRes  (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "firstName TEXT NOT NULL," +
        "email TEXT NOT NULL UNIQUE," +
        "result INT NOT NULL," +
        "serverResult INT NOT NULL," +
        "userResult INT NOT NULL"+
        //"distance INT NOT NULL," +
        //"server_pipe INT NOT NULL," 
        //"user_pipe  INT NOT NULL," +
        //"collision INT NOT NULL" +
        ")", (err) => {
        if (err) {
            // Table already created
        }else {
            //var insert = 'INSERT INTO driver (firstName, lastName, car) VALUES (?,?,?)';
            //db.run(insert, ["admin", "admin@example.com", 1]);
            //db.run(insert, ["admin1", "admin@example.com", 2]);
            //db.run(insert, ["admin", "admin@example.com", 3]);
        }
    });
    db.run("CREATE TABLE if not exists userResult  (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "data TEXT NOT NULL," +
        "firstName TEXT NOT NULL," +
        "email TEXT NOT NULL," +
        "result INT NOT NULL," +
        "enable_colision INT NOT NULL," +
        "detect_collision INT NOT NULL,"+
        "key_presed INT INT NULL," +
        "pipe_speed REAL NOT NULL," +
        "actor_position REAL NOT NULL" +
        ")", (err) => {
        if (err) {
            // Table already created
        }else {
            //var insert = 'INSERT INTO driver (firstName, lastName, car) VALUES (?,?,?)';
            //db.run(insert, ["admin", "admin@example.com", 1]);
            //db.run(insert, ["admin1", "admin@example.com", 2]);
            //db.run(insert, ["admin", "admin@example.com", 3]);
        }
    });
};

module.exports = {
    init: init,
    db: db
};
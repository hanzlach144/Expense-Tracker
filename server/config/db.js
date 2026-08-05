const mysql = require("mysql2");

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    port: process.env.DB_PORT,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME

});

db.connect(function(error){

    if(error){

        console.log("Database Connection Failed");
        console.log(error);
        return;

    }

    console.log("Connected to MySQL");

});

module.exports = db;

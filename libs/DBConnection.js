var mysql = require("mysql"),
    connection,
    data = {},
    players = {};

//local database
// connection = mysql.createConnection({
//    host: "localhost",
//    user: "comp3990",
//    password: "comp3990",
//    database: "comp3990"
// });


// online database
 connection = mysql.createConnection({
     host: "www.db4free.net",
     user: "comp3990",
     password: "comp3990",
     database: "comp3990"
 });


connection.connect(function (err) {
    if (err) {
        console.log("Error Connecting to the serverL: " + err.stack);
        return;
    }
    console.log("Successfully connected to the database");
});


connection.query("SELECT * FROM `stats`", function (err, rows) {
        if (err)
            throw err;
        data = rows;
});


connection.query("SELECT DISTINCT Player_Forename, Player_Surname FROM `stats`", function(err, rows){
    if (err)
            throw err;
        players = rows;
});



module.exports = {
    'returnDBConnection': function(){
    	return connection;
    },
    'allData' : function(){
        return data;
    },
    'players' : function(){
        return players;
    }
}

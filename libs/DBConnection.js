var mysql = require("mysql"),
    connection;

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


module.exports = {
    'returnDBConnection': function(){
    	return connection;
    }
}

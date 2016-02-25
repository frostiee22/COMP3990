// Imports to be used
var dataDir = "./libs/",
	DBACCESS = require(dataDir+'DBConnection'), // set up db connection
	start = 0, end = 0, prevStart = 0, prevEnd = 0;


var express = require('express'), 	// Import the required library
	app = express(),
	bodyParser = require('body-parser'),				// Initialize new instance of an application									
	connection = DBACCESS.returnDBConnection();					


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}))

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});



//We can create the endppoints of out API

app.get ('/api/stats/all',function(req,res){
	res.json(DBACCESS.allData());
});

app.get ('/api/stats/players',function(req,res){
	connection.query("SELECT DISTINCT Player_Forename , Player_Surname from stats ORDER BY `stats`.`Player_Surname` ASC", function(err, rows){
    		if (err)
                  throw err;
                res.json(rows);
	});
});

app.get('/api/stats/goals/:num', function(req,res){
	var num = req.param("num");
	connection.query("SELECT * FROM stats ORDER BY `Goals` DESC limit '0'," + num, function(err, rows){
    		if (err)
                  throw err;
                res.json(rows);
	});	
});


app.get('/api/stats/player/:firstname/:lastname', function(req, res){
	var firstname = req.param("firstname"),
            lastname = req.param("lastname");
            
            connection.query("SELECT * FROM `stats` WHERE Player_Forename = '"+firstname+"' and Player_Surname ='"+lastname+"';", function (err, rows) {
		        if (err) {
		            return err;
		        } else {
		            res.json(rows);
		        }
		    });
});

app.get('/api/stats/:start/:end', function (req, res) {
    var start = req.param("start"),
        end = req.param("end");
        console.log("start :" +start + "| end :" + end);

        if (start == prevStart && end == prevEnd) {
        	console.log("old data");
        	res.json(playerstats);
        }else {
		    connection.query('SELECT * FROM `stats` limit ' + start + ',' + end, function (err, rows) {
		        if (err) {
		            return err;
		        } else {
		        	console.log("new data");
		            res.json(rows);
		            playerstats = rows;
		            prevStart = start;
		            prevEnd = end;
		        }
		    });
		}
});



app.listen(app.get('port'), function () {
   console.log("Node app is running at localhost:" + app.get('port'));
});

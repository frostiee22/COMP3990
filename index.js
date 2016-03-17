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
	connection.query("SELECT * FROM stats ORDER BY `Goals` DESC limit 0," + num, function(err, rows){
    		if (err)
                  throw err;
                res.json(rows);
	});	
});


app.get('/api/stats/player/:firstname/:lastname', function(req, res){
	var firstname = req.param("firstname"),
            lastname = req.param("lastname");
            
            if (firstname != "[fname]"){
            connection.query("SELECT * FROM `stats` WHERE Player_Forename = '"+firstname+"'  and Player_Surname ='"+lastname+"' ORDER BY `Goals` DESC;", function (err, rows) {
		        if (err) {
		            return err;
		        } else {
		            res.json(rows);
		        }
		    });
            }else {
            	connection.query("SELECT * FROM `stats` WHERE Player_Forename = '' and Player_Surname ='"+lastname+"' ORDER BY `Goals` DESC;", function (err, rows) {
		        if (err) {
		            return err;
		        } else {
		            res.json(rows);
		        }
		    });
            }
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


// getting table rows
app.get('/api/:table', function (req, res) {
    var table = req.param("table");
	    connection.query('SELECT * FROM `'+table+'`', function (err, rows) {
	        if (err) {
	            return err;
	        } else {
	            res.json(rows);
	        }
	    });
});



///////////////////////////////////////////////////////////////////////////////////////////////////
// getting data from forms

app.post('/Coach', function (req, res) {

  var fstream, data = {};
  req.pipe(req.busboy);

  // saving the vales in the text field of the form
  req.busboy.on('field', function (fieldname, val) {
    if (fieldname == 'fname')
      data.fname = val;
    else if (fieldname == 'lname')
      data.lname = val;
  });

});



app.post('/Match', function (req, res) {

  var fstream, data = {};
  req.pipe(req.busboy);

  // saving the vales in the text field of the form
  req.busboy.on('field', function (fieldname, val) {
    if (fieldname == 'playerid')
      data.playerid = val;
    else if (fieldname == 'gameid')
      data.gmaeid = val;
  });

});

app.post('/Player', function (req, res) {

  var fstream, data = {}, full, thumb;
  req.pipe(req.busboy);

  // saving the vales in the text field of the form
  req.busboy.on('field', function (fieldname, val) {
    if (fieldname == 'fname')
      data.fname = val;
    else if (fieldname == 'lname')
      data.lname = val;
     else if (fieldname == 'position')
      data.position = val;
     else if (fieldname == 'teamid')
      data.teamid = val;
  });

});

app.post('/Team', function (req, res) {

  var fstream, data = {}, full, thumb;
  req.pipe(req.busboy);

  // saving the vales in the text field of the form
  req.busboy.on('field', function (fieldname, val) {
    if (fieldname == 'coachid')
      data.coachid = val;
    else if (fieldname == 'tname')
      data.tname = val;
  });

});

//////////////////////////////////////////////////////////////////////////////////////////////////




app.listen(app.get('port'), function () {
   console.log("Node app is running at localhost:" + app.get('port'));
});

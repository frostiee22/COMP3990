// Imports to be used
var dataDir = "./libs/",
    DBACCESS = require(dataDir + 'DBConnection'), // set up db connection
    start = 0, end = 0, prevStart = 0, prevEnd = 0;


var express = require('express'), 	// Import the required library
    app = express(),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    bodyParser = require('body-parser'), // Initialize new instance of an application									
    connection = DBACCESS.returnDBConnection();


app.set('port', (process.env.PORT || 5000));
app.use(busboy());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});



//We can create the endppoints of out API

app.get('/api/stats/all', function(req, res) {
    res.json(DBACCESS.allData());
});

app.get('/api/stats/players', function(req, res) {
    connection.query("SELECT DISTINCT Player_ID, Player_Forename , Player_Surname from stats ORDER BY `stats`.`Player_Surname` ASC", function(err, rows) {
        if (err)
            throw err;
        res.json(rows);
    });
});

app.get('/api/stats/goals/:num', function(req, res) {
    var num = req.param("num");
    connection.query("SELECT * FROM stats ORDER BY `Goals` DESC limit 0," + num, function(err, rows) {
        if (err)
            throw err;
        res.json(rows);
    });
});


app.get('/api/stats/player/:firstname/:lastname', function(req, res) {
    var firstname = req.param("firstname"),
        lastname = req.param("lastname");

    if (firstname != "[fname]") {
        connection.query("SELECT * FROM `stats` WHERE Player_Forename = '" + firstname + "'  and Player_Surname ='" + lastname + "' ORDER BY `Goals` DESC;", function(err, rows) {
            if (err) {
                return err;
            } else {
                res.json(rows);
            }
        });
    } else {
        connection.query("SELECT * FROM `stats` WHERE Player_Forename = '' and Player_Surname ='" + lastname + "' ORDER BY `Goals` DESC;", function(err, rows) {
            if (err) {
                return err;
            } else {
                res.json(rows);
            }
        });
    }
});

app.get('/api/stats/:start/:end', function(req, res) {
    var start = req.param("start"),
        end = req.param("end");
    console.log("start :" + start + "| end :" + end);

    if (start == prevStart && end == prevEnd) {
        console.log("old data");
        res.json(playerstats);
    } else {
        connection.query('SELECT * FROM `stats` limit ' + start + ',' + end, function(err, rows) {
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
app.get('/api/:table', function(req, res) {
    var table = req.param("table");
    connection.query('SELECT * FROM `' + table + '`', function(err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
});



///////////////////////////////////////////////////////////////////////////////////////////////////
// getting data from forms

app.get('/Coach/:fname/:lname', function(req, res) {

    var sql, data = {};
    data.lname = req.param("lname");
    data.fname = req.param("fname");

    sql = "INSERT INTO `coach` (`Coach_Forename`,`Coach_Surname`) VALUES ('" + data.fname + "','" + data.lname + "');";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {

        	sql = "SELECT * FROM `coach` WHERE `Coach_Forename` = " + data.fname +" and `Coach_Surname` = " + data.lname;
		    connection.query(sql, function(err, rows) {
		        if (err) {
		            res.json({data: "err",coachid: "err"});
		        } else {
		            res.json({data : "suc",coachid: rows[0].Coach_ID});
		        }
		    });
        }
    });
});

app.get('/Team/:coachid/:tname', function(req, res) {

    var data = {};
    data.coachid = req.param("coachid");
    data.tname = req.param("tname");


    sql = "INSERT INTO `team` (`Coach_ID`,`Team`) VALUES (" + data.coachid + ",'" + data.tname + "');";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {
            res.json({data : "suc"});
        }
    });

});


app.get('/Player/:fname/:lname/:position/:teamid', function(req, res) {

    var data = {}, sql;
    data.lname = req.param("lname");
    data.fname = req.param("fname");
    data.position = req.param("position");
    data.teamid = req.param("teamid");

    sql = "INSERT INTO `player` (`Player_Forename`,`Player_Surname`, `Position_ID`, `Team_ID`) VALUES ('" + data.fname + "','" + data.lname + "',"+ data.position+"," +data.teamid+");";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {
            res.json({data : "suc"});
        }
    });



});

app.get ('/Game/:date/:venue/:team1/:team2',function(req, res){
	var game = {};
	game.date = req.param("date");
	game.venue = req.param("venue");
	game.team1 = req.param("team1");
	game.team2 = req.param("team2");


	sql = "INSERT INTO `game` (`Date`,`Venue`, `Team1_ID`, `Team2_ID`) VALUES ('" + game.date + "','" + game.venue + "',"+ game.team1+"," + game.team2 +");";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {
            res.json({data : "suc"});
        }
    });

});



app.get('/Match/:playerid/:gameid/:goals/:succesfulpasses/:unsuccesfulpasses/:touches/:duelswon/:duelslost/:handballsconceded/:penaltiesconceded/:yellowcard/:redcard', function(req, res) {

    var data = {};
    data.playerid = req.param("playerid");
    data.gameid = req.param("gameid");
    data.goals = req.param("goals");
    data.succesfulpasses = req.param("succesfulpasses");
    data.unsuccesfulpasses = req.param("unsuccesfulpasses");
    data.touches = req.param("touches");
    data.duelswon = req.param("duelswon");
    data.duelslost = req.param("duelslost");
    data.handballsconceded = req.param("handballsconceded");
    data.penaltiesconceded = req.param("penaltiesconceded");
    data.yellowcard = req.param("yellowcard");
    data.redcard = req.param("redcard");


    sql = "INSERT INTO `player_game` (`Player_ID`, `Game_ID`, `Goals`, `Passes_Succesful`, `Passed_Unsuccessful`, `Touches`, `Duels_Won`, `Duels_Lost`, `Handballs_Conceded`, `Penalties_Conceded`, `Yellow_Cards`, `Red_Cards`) VALUES " + 
    "(" +data.playerid+","+data.gameid+", "+data.goals+", "+data.succesfulpasses+", "+data.unsuccesfulpasses+", "+data.touches+", "+data.duelswon+", "+data.duelslost+", "+handballsconceded+","+penaltiesconceded+", "+yellowcard+", "+redcard+")";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {
            res.json({data : "suc"});
        }
    });
});





//////////////////////////////////////////////////////////////////////////////////////////////////




app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

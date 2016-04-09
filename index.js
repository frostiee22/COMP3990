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


app.set('port', (process.env.PORT || 1234));
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


app.get('/api/details/player/:ID', function(req, res) {
    var playerID = req.param("ID");
        connection.query("SELECT * FROM `player_game` WHERE Player_ID = " + playerID + " ORDER BY `Goals` DESC;", function(err, rows) {
            if (err) {
                return err;
            } else {
                res.json(rows);
            }
        });
});

app.get('/api/playeravg/:ID', function(req, res) {
    var playerID = req.param("ID");
        connection.query("SELECT * FROM `playeravg` WHERE Player_ID = " + playerID, function(err, rows) {
            if (err) {
                return err;
            } else {
                res.json(rows);
            }
        });
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



app.get('/api/pos/:val',function(req,res){

	var pos = req.param("val");

	connection.query('SELECT * FROM `playeravg` WHERE Position_ID = ' + pos, function(err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
})


// retrieving the playes belonging to a coach team
app.get('/api/coach/players/:coachid',function(req,res){
	var coachid = req.param("coachid");
	connection.query('SELECT * FROM `playeravg` WHERE playeravg.Player_ID in (SELECT Player_ID from `player`, `team` WHERE team.Coach_ID = '+ coachid +' and team.Team_ID = player.Team_ID);', function(err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
})


///////////////////////////////////////////////////////////////////////////////////////////////////
// getting data from forms

app.get('/Coach/:fname/:lname/:username', function(req, res) {

    var sql, data = {};
    data.lname = req.param("lname");
    data.fname = req.param("fname");
    data.username = req.param("username");

    sql = "INSERT INTO `coach` (`Coach_Forename`,`Coach_Surname`,`username`) VALUES ('" + data.fname + "','" + data.lname + "','"+data.username+"');";

    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {

        	sql = "SELECT * FROM `coach` WHERE `username` LIKE '"+data.username+"'";
		    connection.query(sql, function(err, rows) {
		        if (err) {
		            res.json({data: "err",coachid: "err"});
		        } else {
		            res.json({data : "suc",coachid: rows});
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


    sql = "INSERT INTO `player_game` (`Player_ID`, `Game_ID`, `Goals`, `Passes_Succesful`, `Passed_Unsuccessful`, `Touches`, `Duels_Won`, `Duels_Lost`, `Handballs_Conceded`, `Penalties_Conceded`, `Yellow_Cards`, `Red_Cards`) VALUES " + "(" +data.playerid+","+data.gameid+", "+data.goals+", "+data.succesfulpasses+", "+data.unsuccesfulpasses+", "+data.touches+", "+data.duelswon+", "+data.duelslost+", "+data.handballsconceded+","+data.penaltiesconceded+", "+data.yellowcard+", "+data.redcard+")";
    connection.query(sql, function(err, rows) {
        if (err) {
            res.json({data: "err"});
        } else {
            res.json({data : "suc"});
        }
    });
});





//////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////
// WIPE DB
app.get('/DELETE', function(req, res){
	connection.query("DELETE FROM `player_game`", function(err, rows) {
		if (err) {
		   console.log("error deleting player_game");
		} else {
			connection.query("DELETE FROM `player`", function(err, rows) {
				if (err) {
				    console.log("error deleting player");
				} else {
					connection.query("DELETE FROM `game`", function(err, rows) {
						if (err) {
						    console.log("error deleting game");g
						} else {
							connection.query("DELETE FROM `team`", function(err, rows) {
								if (err) {
								    console.log("error deleting team");
								} else {
									connection.query("DELETE FROM `coach`", function(err, rows) {
										if (err) {
										    console.log("error deleting coach");
										} else {
										    res.json({message :"Data deleted"});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
	
})






app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

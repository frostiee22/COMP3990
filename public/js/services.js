angular.module('app.services', [])

    .factory('getData', function($http) {
        return {
            update: function() {

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/team')
                        .success(function(response) {
                            Save(response, "teams");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 200);

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/simplegame')
                        .success(function(response) {
                            Save(response, "newgames");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 400);

                setTimeout(function() {
                    $http
                        .get('http://uwiproject.herokuapp.com/api/simpleplayer')
                        .success(function(response) {
                            Save(response, "newplayers");
                        })
                        .error(function(data) {
                            $scope.response = "error uploading!";
                        });
                }, 600);
            }
        }
    })

    .service('BlankService', [function() {

    }])

    .factory('Players', function($http, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();
            d.resolve(Update("newplayers"));
            return d.promise;
        }
        results.all = _all;
        return results;
    })

    .factory('PlayerDetails', function($http, $timeout, $q) {
        var results = {};
        function _all() {
            var d = $q.defer();
            $http
                .get("http://uwiproject.herokuapp.com/api/details/player/" + item.Player_ID)
                .success(function(response) {
                    //caching data
                    Save(response, "playerdetails");
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch item data");
                    console.log("Unable to fetch item data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })


    .factory('TopGoals', function($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/stats/goals/5")
                .success(function(response) {
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch most goals");
                    console.log("Unable to fetch most goals");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })

    .factory('SimpleData', function($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/simple")
                .success(function(response) {
                    Save(response, "SimpleData");
                    d.resolve(response);
                })
                .error(function(data) {
                    alert("Unable to fetch simple data");
                    console.log("Unable to fetch simple data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })




////////////////////////////////////////////////////////


// saving data to a given key
function Save(data, key) {
    console.log("Attempting to save: " + key);
    var DataStored = localStorage.getItem(key);
    if (!DataStored) DataStored = [];
    else DataStored = JSON.parse(DataStored);
    DataStored = data;
    localStorage.setItem(key, JSON.stringify(DataStored));
    data = {};
}

// recieving data from a given key
function Update(key) {
    console.log("Attempting to Fetch from LocalStorage : " + key);
    return JSON.parse(localStorage.getItem(key));
}




function forEach(arr, operation) {
    for (var i = 0; i < arr.length; i += 1) {
        operation(arr[i]);
    }
}

function getItemStores(ItemID) {
    var StoresItems = Update("storeitem"),
        data = [];
    forEach(StoresItems, function(storeitem) {
        if (storeitem.itemid == ItemID) {
            var temp = {};
            temp = getStoreName(storeitem.storeid);
            temp.itemname = item.name;
            temp.price = storeitem.price;
            data.push(temp);
        }
    });
    return data;
}

// getting storeNmae
function getStoreName(StoreID) {
    var stores = Update("stores"),
        temp = {};
    forEach(stores, function(store) {
        if (store.storeid == StoreID) {
            temp = store;
        }
    });
    return temp;
}


// get itemName
function getItemName(ItemId) {
    var items = Update("items"),
        temp = {};
    forEach(items, function(item) {
        if (item.itemid = ItemId) {
            temp = item;
        }
    });
    return temp;
}

// item details given barcode
function itemDetails(barcode) {
    var items = Update("items"),
        temp = {};
    forEach(items, function(item) {
        if (item.barcode == barcode) {
            temp = item;
        }
    });
    return temp;
}


function SimplePlayerDetails(Player_ID) {
    var SPD = Update("SimpleData"),
        temp = {};
    forEach(SPD, function(s) {
        if (s.Player_ID == Player_ID) {
            temp = s;
        }
    });
    return temp;
}


function GameID2Game(games) {
    forEach(games, function(game) {
        game.name = GameID(game.Game_ID);
    });
    return games;
}

function GameID(gameid) {
    var simplegames = Update("newgames"),
        temp = {};
    forEach(simplegames, function(game) {
        if (game.Game_ID == gameid) {
            temp = game.game;
        }
    });
    return temp;
}

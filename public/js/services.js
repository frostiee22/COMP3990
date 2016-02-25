angular.module('app.services', [])

    .factory('getData', function ($http) {
        return {
            update: function () {

            }
        }
    })

    .service('BlankService', [function () {

    }])

    .factory('Items', function ($http, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();
           
            // getting data from the items table
            $http
                .get("http://uwiproject.herokuapp.com/api/stats/players")
                .success(function (response) {
                    //caching data
                    console.log(response);
                    Save(response, "items");
                    d.resolve(response);
                })
                .error(function (data) {
                    alert("Unable to fetch item data");
                    console.log("Unable to fetch item data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })

    .factory('ItemDetails', function ($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/stats/player/" + item.Player_Forename + "/" + item.Player_Surname)
                .success(function (response) {
                    //caching data
                    console.log(response);
                    Save(response, "player");
                    d.resolve(response);
                })
                .error(function (data) {
                    alert("Unable to fetch item data");
                    console.log("Unable to fetch item data");
                });
            return d.promise;
        }
        results.all = _all;
        return results;
    })


    .factory('TopGoals', function ($http, $timeout, $q) {
        var results = {};

        function _all() {
            var d = $q.defer();

            $http
                .get("http://uwiproject.herokuapp.com/api/stats/goals/5")
                .success(function (response) {
                    d.resolve(response);
                })
                .error(function (data) {
                    alert("Unable to fetch most goals");
                    console.log("Unable to fetch most goals");
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
    console.log(data);
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
    forEach(StoresItems, function (storeitem) {
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
    forEach(stores, function (store) {
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
    forEach(items, function (item) {
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
    forEach(items, function (item) {
        if (item.barcode == barcode) {
            temp = item;
        }
    });
    return temp;
}



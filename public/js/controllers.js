var item;

angular.module('app.controllers', [])

    .controller('OnloadCtrl', ['$scope', '$http', 'getData', function($scope, $http, getData) {
        Save({}, "items");
        Save({}, "stores");
        Save({}, "storeitem");
        getData.update();
    }])

    .controller('enterCtrl', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
        console.log("enterCtrl launched");
        
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };


    }])

    .controller('itemSearchCtrl', ['$scope', 'Items', function($scope, Items) {
        console.log("itemSearchCtrl");
        $scope.items = [{ name: 'loading...' }];
        Items.all().then(
            function(res) {
                $scope.items = res;
            },
            function(err) {
                console.error(err);
            }
        );

        $scope.details = function() {
            item = {};
            item = this.item;
            if (item.Player_Forename == "") {
                item.Player_Forename = "[fname]";
            }
        }
    }])

    .controller('itemDetailsCtrl', ['$scope', 'ItemDetails', function($scope, ItemDetails) {
        console.log("itemDetailsCtrl");

        $scope.stores = [{ name: 'Loading..' }];
        ItemDetails.all().then(
            function(res) {
                $scope.stores = res;
            },
            function(err) {
                console.error(err);
            }
        );
    }])

    .controller('previousListsCtrl', function($scope) {

    })

    .controller('homeCtrl', ['$scope', '$http', 'TopGoals', function($scope, $http, TopGoals) {
        console.log("homeCtrl");
        TopGoals.all().then(
            function(stats) {
                $scope.labels = [stats[0].Player_Surname, stats[1].Player_Surname, stats[2].Player_Surname, stats[3].Player_Surname, stats[4].Player_Surname];
                $scope.series = ['Goals'];
                $scope.data = [
                    [stats[0].Goals, stats[1].Goals, stats[2].Goals, stats[3].Goals, stats[4].Goals]
                ];
            },
            function(err) {
                console.error(err);
            }
        );




    }])








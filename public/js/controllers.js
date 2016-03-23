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

    .controller('itemSearchCtrl', ['$scope', 'Players','SimpleData', '$ionicPopover', function($scope, Players, SimpleData, $ionicPopover) {
        console.log("itemSearchCtrl");
        $scope.items = [{ name: 'loading...' }];
        Players.all().then(
            function(res) {
                $scope.items = res;
            },
            function(err) {
                console.error(err);
            }
        );
        
        // getting simplify data of players
        SimpleData.all().then(
            function(res) {
                $scope.SimpleData = res;
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

        /////////////////////////////////////////////////////
        // POP OVER
        console.log("hold :D");
        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
             item = this.item;
             $scope.name = item;
             var temp = SimplePlayerDetails(item.Player_ID);
             console.log(temp);
             $scope.SPD = temp;
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        
        ///////////////////////////////////////////////////////
        
    }])

    .controller('itemDetailsCtrl', ['$scope', 'ItemDetails', '$ionicSideMenuDelegate', function($scope, ItemDetails, $ionicSideMenuDelegate) {
        console.log("itemDetailsCtrl");

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

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








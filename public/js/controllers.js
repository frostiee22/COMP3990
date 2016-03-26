var item;

angular.module('app.controllers', [])

    .controller('OnloadCtrl', ['$scope', '$http', 'getData', function($scope, $http, getData) {
        Save({}, "items");
        Save({}, "stores");
        Save({}, "storeitem");
        getData.update();

        $http
            .get('http://uwiproject.herokuapp.com/api/team')
            .success(function(response) {
                Save(response, "teams");
            })
            .error(function(data) {
                $scope.response = "error uploading!";
            });

    }])

    .controller('enterCtrl', ['$scope', '$http', '$ionicSideMenuDelegate', '$ionicActionSheet', '$timeout', function($scope, $http, $ionicSideMenuDelegate, $ionicActionSheet, $timeout) {
        console.log("enterCtrl launched");

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };


        // COACH FORM
        $scope.submitCoach = function() {
            var link = "http://uwiproject.herokuapp.com/Coach/" + $scope.coach.fname + "/" + $scope.coach.lname;
            console.log(link);
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.coach = {};
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    console.log("Unable to fetch item data");
                    $scope.response = "error uploading!";
                });
        };


        // MATCH FORM
        $scope.submitMatch = function() {
            var m = $scope.match;
            var link = "http://uwiproject.herokuapp.com/Match/" + m.playerid + "/" + m.gameid;
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.match = {};
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };

        //PLAYER FORM




        console.log(Update("teams"));
        $scope.teams = Update("teams");
        
        $scope.submitPlayer = function() {
            var p = $scope.player;
            var link = "http://uwiproject.herokuapp.com/Player/" + p.fname + "/" + p.lname + "/" + p.position + "/" + p.team.Team_ID.Team_ID;
            console.log(link);
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.player = {};
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };


        $scope.showSheet = function() {
            // Show the action sheet
            if ($scope.player == null) {
                $scope.player = {};
            }

            var PlayerPosition;
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Attacker' },
                    { text: 'Defender' },
                    { text: 'Mid Fielder' },
                    { text: 'Goalkeeper' }
                ],
                destructiveText: 'Delete',
                titleText: 'Select Your Position',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) PlayerPosition = 6;
                    else if (index == 1) PlayerPosition = 2;
                    else if (index == 2) PlayerPosition = 4;
                    else if (index == 3) PlayerPosition = 1;
                    else {
                        PlayerPosition = 0;
                    }
                    var pos = $scope.player.position = PlayerPosition;

                    if (pos == 1 || pos == 2 || pos == 4 || pos == 6) {
                        $timeout(function() {
                            hideSheet();
                        }, 150);
                    }

                    return PlayerPosition;
                }
            });

            // For example's sake, hide the sheet after two seconds
            // $timeout(function() {
            //     hideSheet();
            // }, 3000);

        };


        //TEAM FORM
        
        function updateTeams() {
            $http
                .get('http://uwiproject.herokuapp.com/api/team')
                .success(function(response) {
                    Save(response, "teams");
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        }
        
        $scope.submitTeam = function() {
            var t = $scope.team;
            var link = "http://uwiproject.herokuapp.com/Team/" + t.coachid + "/" + t.tname;
            $http
                .get(link)
                .success(function(response) {
                    if (response.data == 'suc') {
                        $scope.response = "successful";
                        $scope.team = {};
                        updateTeams();
                    }
                    else {
                        $scope.response = "error uploading!";
                    }
                })
                .error(function(data) {
                    $scope.response = "error uploading!";
                });
        };


    }])

    .controller('itemSearchCtrl', ['$scope', 'Players', 'SimpleData', '$ionicPopover', function($scope, Players, SimpleData, $ionicPopover) {
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








var item;

angular.module('app.controllers', [])

    .controller('OnloadCtrl', ['$scope', '$http', 'getData', function ($scope, $http, getData) {
        Save({}, "items");
        Save({}, "stores");
        Save({}, "storeitem");
        getData.update();
    }])

    .controller('barcodeScannerCtrl', ['$scope', '$cordovaBarcodeScanner', function ($scope, $cordovaBarcodeScanner) {
        console.log("barcodeScannerCtrl launched");

    }])

    .controller('itemSearchCtrl', ['$scope', 'Items', function ($scope, Items) {
        console.log("itemSearchCtrl");
        $scope.items = [{ name: 'loading...' }];
        Items.all().then(
            function (res) {
                $scope.items = res;
            },
            function (err) {
                console.error(err);
            }
            );

        $scope.details = function () {
            item = {};
            item = this.item;
        }
    }])

    .controller('itemDetailsCtrl', ['$scope', 'ItemDetails', function ($scope, ItemDetails) {
        console.log("itemDetailsCtrl");

        $scope.stores = [{ name: 'Loading..' }];
        ItemDetails.all().then(
            function (res) {
                $scope.stores = res;
            },
            function (err) {
                console.error(err);
            }
            );
    }])

    .controller('previousListsCtrl', function ($scope) {

    })

    .controller('homeCtrl', ['$scope', '$http', 'TopGoals', function ($scope, $http, TopGoals) {
        console.log("homeCtrl");
        TopGoals.all().then(
            function (res) {
                var data = MostGoals(res);
                console.log(data);
                $scope.goals = data;
            },
            function (err) {
                console.error(err);
            }
            );


    }])








angular.module('app.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider



            .state('tabsController.home', {
                url: '/page6',
                views: {
                    'tab4': {
                        templateUrl: 'templates/home.html'
                    }
                }
            })

            .state('tabsController.barcodeScanner', {
                url: '/page2',
                views: {
                    'tab1': {
                        templateUrl: 'templates/barcodeScanner.html',
                        controller: 'barcodeScannerCtrl'
                    }
                }
            })


            .state('tabsController.itemSearch', {
                url: '/page3',
                views: {
                    'tab2': {
                        templateUrl: 'templates/itemSearch.html'
                    }
                }
            })

            .state('tabsController.details', {
                url: '/page7',
                views: {
                    'tab2': {
                        templateUrl: 'templates/details.html'
                    }
                }
            })


            .state('tabsController.previousLists', {
                url: '/page4',
                views: {
                    'tab3': {
                        templateUrl: 'templates/previousLists.html',
                        controller: 'previousListsCtrl'
                    }
                }
            })


            .state('tabsController', {
                url: '/page1',
                abstract: true,
                templateUrl: 'templates/tabsController.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/page1/page6');

    });
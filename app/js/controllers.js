'use strict';

/* Controllers */

var weddingControllers = angular.module('weddingControllers', []);

weddingControllers.controller('HeaderController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            if ($location.url()) {
                return $location.url().indexOf(viewLocation) === 0;
            }
            return false;
        }
    }]);

weddingControllers.controller('HomeCtrl', ['$scope', 'MapIconMarker',
    function ($scope, MapIconMarker) {
        $scope.markers = {
            'alia': {
                lat: 46.791364,
                lng: 0.624408,
                title: 'La ferme Alia',
                message: '<address><strong>La ferme Alia</strong><br/>Place de la Foucaudière<br/>86100 Saint-Sauveur</address>',
                focus: true,
                icon: MapIconMarker.icon('img/icons/FermeAlia_map.png')
            }
        };

        $scope.center = {
            lat: 46.791364,
            lng: 0.624408,
            zoom: 10
        };

        $scope.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: true
        };

        $scope.weddingDate = new Date("2015/08/29 17:00:00");

    }]);

weddingControllers.controller('GiftListCtrl', ['$scope', 'GiftsResource',
    function ($scope, GiftsResource) {
        GiftsResource.query().$promise
            .then(function (gifts) {
                console.log(gifts);
                $scope.gifts = [];
                angular.forEach(gifts.gifts, function (gift) {
                    gift.to_book = 0;
                    $scope.gifts.push(gift);
                });
            });

        $scope.types = [
            {
                display: "Activité",
                checked: true
            },
            {
                display: "Restaurant",
                checked: true
            },
            {
                display: "Hôtel",
                checked: true
            }
        ];

        $scope.cities = [
            {
                display: "Rome",
                checked: true
            },
            {
                display: "Venise",
                checked: true
            },
            {
                display: "Florence",
                checked: true
            }
        ];

        $scope.markers = {};

        $scope.mapCenter = {
            lat: 43.5,
            lng: 12,
            zoom: 6
        };

        $scope.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: true
        };

    }]);

weddingControllers.controller('AccommodationCtrl', ['$scope', 'AccommodationResource', 'MapIconMarker',
    function ($scope, AccommodationResource, MapIconMarker) {
        $scope.accommodations = AccommodationResource.query().$promise.then(function (accommodations) {
            console.log(accommodations);
            $scope.accommodations = accommodations.accommodations;
        });

        $scope.types = [
            {
                display: "Hôtel",
                checked: true
            },
            {
                display: "Camping",
                checked: true
            },
            {
                display: "Chambre d'hôtes",
                checked: true
            },
            {
                display: "Gîte",
                checked: true
            }];

        $scope.markers = {
            'alia': {
                lat: 46.791364,
                lng: 0.624408,
                title: 'La ferme Alia',
                message: '<a href="http://www.lafermealia.fr" target="_blank">La ferme Alia</a>',
                icon: MapIconMarker.icon('img/icons/FermeAlia_map.png')
            }
        };

        $scope.mapCenter = {
            lat: 46.78,
            lng: 0.6,
            zoom: 11
        };

        $scope.mapDefaults = {
            scrollWheelZoom: false,
            doubleClickZoom: true
        };
    }]);

weddingControllers.controller('ContactCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
        $scope.openReply = function () {

            var modalInstance = $modal.open({
                templateUrl: 'partials/components/reply-form.html',
                controller: 'ReplyFormCtrl'
            });

            modalInstance.result.then(function () {
                console.info('Reply form modal dismissed at: ' + new Date());
            });
        };

        $scope.openContact = function () {

            var modalInstance = $modal.open({
                templateUrl: 'partials/components/contact-form.html',
                controller: 'ContactFormCtrl'
            });

            modalInstance.result.then(function () {
                console.info('Contact form modal dismissed at: ' + new Date());
            });
        };
    }]);

weddingControllers.controller('ReplyFormCtrl', ['$scope', '$modalInstance', 'ReplyResource',
    function ($scope, $modalInstance, ReplyResource) {
        $scope.reply = {
            name: '',
            email: '',
            adultNb: 1,
            childNb: 0,
            comment: '',
            password: ''
        };

        $scope.alerts = [];

        $scope.isDisabled = function (reply) {
            return !reply.$dirty || reply.$invalid;
        };

        $scope.save = function (reply) {
            if ($scope.isDisabled(reply)) return;
            ReplyResource.save($scope.reply).$promise
                .then(function (response) {
                    console.log("Reply sent: " + response);
                    reply.$dirty = false;
                    $modalInstance.close('reply form saved');
                })
                .catch(function () {
                    $scope.alerts.push({type: 'danger', msg: "Les informations n'ont pas pu être transmises."});
                    console.error("Something went wrong while sending reply form")
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.adultPlus = function () {
            if ($scope.reply.adultNb < 9) {
                $scope.reply.adultNb += 1;
            }
        };

        $scope.adultMinus = function () {
            if ($scope.reply.adultNb > 0) {
                $scope.reply.adultNb -= 1;
            }
        };

        $scope.childPlus = function () {
            if ($scope.reply.childNb < 9) {
                $scope.reply.childNb += 1;
            }
        };

        $scope.childMinus = function () {
            if ($scope.reply.childNb > 0) {
                $scope.reply.childNb -= 1;
            }
        };
    }]);

weddingControllers.controller('ContactFormCtrl', ['$scope', '$modalInstance', 'ContactResource',
    function ($scope, $modalInstance, ContactResource) {
        $scope.contactForm = {
            name: '',
            email: '',
            password: '',
            message: ''
        };

        $scope.alerts = [];

        $scope.isDisabled = function (contact) {
            return !contact.$dirty || contact.$invalid;
        };

        $scope.save = function (contact) {
            if ($scope.isDisabled(contact)) return;
            ContactResource.save($scope.contactForm).$promise
                .then(function (response) {
                    console.log("Contact sent: ", response);
                    contact.$dirty = false;
                    $modalInstance.close('contact form saved');
                })
                .catch(function (response) {
                    $scope.alerts = [];
                    console.log(response);
                    if (response.status == 403) {
                        $scope.alerts.push({type: 'danger', msg: "Le mot de passe est incorrect"});
                        console.error("Wrong password");
                    } else {
                        $scope.alerts.push({type: 'danger', msg: "Les informations n'ont pas pu être transmises."});
                        console.error("Something went wrong while sending contact form");
                    }
                });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

weddingControllers.controller('GiftBookFormCtrl', ['$scope', '$modalInstance', 'BookResource',
    function ($scope, $modalInstance, BookResource) {
        $scope.bookingForm = {
            password: '',
            name: '',
            message: ''
        };

        $scope.alerts = [];

        $scope.isDisabled = function (form) {
            return !form.$dirty || form.$invalid;
        };

        $scope.save = function (form) {
            if ($scope.isDisabled(form)) return;
            var booking = {
                gift: $scope.gift.id,
                booked: $scope.gift.to_book,
                password: form.password,
                name: form.name,
                message: form.message
            };
            console.log(booking);
            BookResource.book(booking).$promise
                .then(function (response) {
                    console.log("Booking sent: ", response);
                    form.$dirty = false;
                    $modalInstance.close('booking form saved');
                })
                .catch(function (response) {
                    $scope.alerts = [];
                    console.log(response);
                    if (response.status == 403) {
                        $scope.alerts.push({type: 'danger', msg: "Le mot de passe est incorrect"});
                        console.error("Wrong password");
                    } else {
                        $scope.alerts.push({type: 'danger', msg: "Les informations n'ont pas pu être transmises."});
                        console.error("Something went wrong while sending booking form");
                    }
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
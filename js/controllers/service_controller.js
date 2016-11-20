twitter_map_view.controller('service_controller', ['$scope', 'twitter', 'coordinates', function($scope, twitter, coordinates) {

  $scope.tweets =[];
  $scope.displaytweets = [];

  $scope.lat = -25.35;
  $scope.lng = 131.04;

  twitter.initialize();
  $scope.error = false;

  $scope.search = function(location) {
    coordinates.getGeocode(location).then(function(geocode) {
      if (geocode === null) {
        $scope.$apply(function() {
          $scope.error = true;
        });
        return [];
      } else {
        $scope.error = false;
        $scope.lat = geocode['lat'];
        $scope.lng = geocode['lng'];
        return twitter.getTweetsByGeocode(geocode);
      }

    }).then(function(twitter_data) {
      $scope.tweets = [];
      $scope.displaytweets = [];
      $scope.tweets = $scope.tweets.concat(coordinates.standardizeCoordinates(twitter_data, $scope.lat, $scope.lng));
      console.log($scope.tweets);
    });
  }


  $scope.connect = function() {
    twitter.connectTwitter().then(function() {
      if (twitter.isReady()) {
        display_search();
      } else {
        $('#error').removeClass('hidden');
      }
    });
  }

  $scope.signout = function() {
    twitter.clearCache();
    $scope.tweets = [];
    $scope.displaytweets = [];
    // Display connect
    $('#connect').removeClass('hidden');
    $('#search').addClass('hidden');
    $('#signout').addClass('hidden');
}

  $scope.displayTweets = function(event) {
    $scope.displaytweets = [];
    if (this.title == "center") { // tweets that don't have exact coordinates
      var curr_tweet ={};
      for (var i = 0; i < $scope.tweets.length; i++) {
        curr_tweet = $scope.tweets[i];
        if (curr_tweet['coordinates'] == null && curr_tweet['place'] == null) {
          $scope.displaytweets = $scope.displaytweets.concat(curr_tweet);
        }
      }
    } else {
      $scope.displaytweets = $scope.displaytweets.concat($scope.tweets[this.index]);
    }
    console.log($scope.displaytweets);
  }
  if(twitter.isReady()) {
    display_search()
  }

  function display_search() {
    $('#connect').addClass('hidden');
    $('#error').addClass('hidden');
    $('#search').removeClass('hidden');
    $('#signout').removeClass('hidden');
  }
}]);

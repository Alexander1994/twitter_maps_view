twitter_map_view.factory('google_maps', [function() {
  return {
    function addMapMarkers(twitter_data) {
      var tweets = twitter_data['statuses'];
      for (var i = 0; i < twitter_data['statuses'].length; i++) {
        if (tweets[i]['coordinates'] != null) {
          
        } else {

        }
      }
    }
  };
}]);

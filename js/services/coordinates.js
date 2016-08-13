twitter_map_view.factory('coordinates', ['$http', '$q',  function($http, $q) {

  // Local function, Returns value in km
  function len_between_coordinates(northeast, southwest) {
    var R = 6371e3;
    var d_lat = to_radians(northeast['lat'] - southwest['lat']);
    var d_lng = to_radians(northeast['lng'] - southwest['lng']);
    var NE_lat = to_radians(northeast['lat']);
    var SW_lat = to_radians(southwest['lat']);

    var a = Math.sin(d_lat/2) * Math.sin(d_lat) +
            Math.cos(NE_lat) * Math.cos(SW_lat) *
            Math.sin(d_lng/2) * Math.sin(d_lat/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  // degree -> radians
  function to_radians(degrees) {
    return (degrees * Math.PI / 180)/1000;
  }

  function to_degrees(radians) {
    return (radians*1000*180/Math.PI)
  }

  function midPoint(pointA, pointB) {
    var lat1 = to_radians(pointA[0]);
    var lon1 = to_radians(pointA[1]);

    var lat2 = to_radians(pointB[0]);
    var lon2 = to_radians(pointB[1]);

    var dLon = to_radians(pointB[1] - pointA[1]);

    var pointM = [];

    if (lat1==lat2 && lon1 == lon2) {
      return pointA;
    }

    var Bx = Math.cos(lat2) * Math.cos(dLon);
    var By = Math.cos(lat2) * Math.sin(dLon);


    var lat3 = Math.atan2( Math.sin(lat1) + Math.sin(lat2), Math.sqrt( (Math.cos(lat1)+Bx) * (Math.cos(lat1)+Bx) + By*Bx) );
    var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    pointM[0] = to_degrees(lat1);
    pointM[1] = to_degrees(lon1);
    return pointM;
  }

  return  {
    getGeocode: function(location) {
      var deffered = $q.defer();
      var url_encoded_loc = encodeURIComponent(location);
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ url_encoded_loc)
      .then(function(google_data) {
        var location_coordinates = google_data['data']['results'][0]['geometry'];
        var lat = location_coordinates['location']['lat'];
        var lng = location_coordinates['location']['lng'];
        var northeast = location_coordinates['bounds']['northeast'];
        var southwest = location_coordinates['bounds']['southwest'];
        var distance = len_between_coordinates(northeast, southwest)/2;
        var geocode = {
          lat: lat,
          lng: lng,
          distance: distance
        };
        deffered.resolve(geocode);
      }, function(err) {
        deffered.reject(err);
      });
      return deffered.promise;
    },
    standardizeCoordinates: function(twitter_data, lat, lng) {
      var tweets = twitter_data['statuses'];
      var curr_tweet = {};
      var bounding_box = [];
      var geo_coordinate = {};
      var add_center_marker = false;

      for (var i=0; i < tweets.length; i++) {
        curr_tweet = tweets[i];
        if (curr_tweet['coordinates'] == null && curr_tweet['place'] != null) {
          bounding_box = curr_tweet['place']['bounding_box']['coordinates'][0];
          geo_coordinate = {
            "type": "Point",
            "coordinates": midPoint(bounding_box[0], bounding_box[2])
          };
          tweets[i]['coordinates'] = geo_coordinate;
        }
        if (curr_tweet['coordinates'] == null && curr_tweet['place'] == null) {
          add_center_marker = true;
        }
      }

      if (add_center_marker) {
        var center = {
          text: "center",
          coordinates: {
            coordinates: [lng, lat]
          }
        };
        tweets = tweets.concat(center);
      }
      return tweets;
    }

  }
}]);

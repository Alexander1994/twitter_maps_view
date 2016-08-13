
twitter_map_view.factory('twitter', ['$http', function($http) {
  var authorizationResult = false;

  return  {
    initialize: function() {
      OAuth.initialize('Vtk9JnuusQxZvGjmgBEAHO2keFU', {cache:true});
      authorizationResult = OAuth.create('twitter');
    },
    clearCache: function() {
      OAuth.clearCache('twitter');
    },
    isReady: function() {
        return (authorizationResult);
    },
    connectTwitter: function() {
      return new Promise(function(resolve, reject){
        OAuth.popup('twitter', {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
          if (!error) {
            console.log(result);
            authorizationResult = result;
            resolve(result);
          } else {
            reject(error);
            console.log(error);
          }
        });
      });
    },
    getTweetsByGeocode: function (geocode) {
        return new Promise(function(resolve, reject) {
          var geocode_string = geocode['lat']+","+geocode['lng']+","+geocode['distance']+"km";
          var url_encoded_geocode = encodeURIComponent(geocode_string);
          var url='/1.1/search/tweets.json?q=&geocode='+url_encoded_geocode+'&result_type=recent';
          authorizationResult.get(url).done(function(data) {
            resolve(data);
          }).fail(function(err) {
            reject(err);
          });

        });
    },
    getAccesToken: function() {
      var url = window.location.href;
      var access_token = url.substring(url.indexOf('=')).substring(1);
    }
  }
}]);

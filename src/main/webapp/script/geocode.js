//	  var geocoder = new google.maps.Geocoder;
//	  var infowindow = new google.maps.InfoWindow;
//	  geocodeAddress(geocoder, map);
//	  geocodeLatLng(geocoder, map, infowindow);

//test geocode
function geocodeAddress(geocoder, resultsMap) {
	  var address = "台北";
	  geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      resultsMap.setCenter(results[0].geometry.location);
	      var marker = new google.maps.Marker({
	        map: resultsMap,
	        position: results[0].geometry.location
	      });
	      console.log(JSON.stringify(results));
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
}

//test reverse geocode
function geocodeLatLng(geocoder, map, infowindow) {
	  //var input = document.getElementById('latlng').value;
	var input = "25.042650,121.524600";
	  var latlngStr = input.split(',', 2);
	  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	  geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	        map.setZoom(11);
	        var marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	        });
	        infowindow.setContent(results[1].formatted_address);
	        infowindow.open(map, marker);
	        console.log(JSON.stringify(results));
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
	  });
	}
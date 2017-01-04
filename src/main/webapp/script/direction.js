var map;
var latlng = function(lat, lng) {
	this.lat = lat;
	this.lng = lng;
};
var route = [{lat: 25.042650000000002, lng:121.5246},{lat: 25.042418, lng: 121.524504},
	//1
	{lat: 25.032650000000002, lng:121.5246},{lat: 25.04201, lng:121.52441},{lat: 25.041710, lng: 121.524281},{lat: 25.041220000000003, lng:121.52417000000001},{lat: 25.040910000000004, lng:121.52408000000001},
	//2
	{lat: 25.040630000000004, lng:121.52399000000001},{lat: 25.0407, lng:121.52368000000001},{lat: 25.04079, lng:121.52333000000002},{lat: 25.040910000000004, lng:121.52283000000001},
	//3
	{lat: 25.041040000000002, lng:121.52225000000001},{lat: 25.041175, lng:121.521761},{lat: 25.04145, lng:121.52049000000001},{lat: 25.041600000000003, lng:121.51989},{lat: 25.041420000000002, lng:121.51989},{lat: 25.04135, lng:121.51988000000001},{lat: 25.041310000000003, lng:121.51992000000001},{lat: 25.04128, lng:121.52004000000001} ];

var directionRoute;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : 25.040698,
			lng : 121.519055
		}, // 台大醫院
		zoom : 17
	});
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);

	var org = new latlng(25.042651, 121.524593); // 成功中學
	var des = new latlng(25.041253, 121.520035); // 台大醫院
	calculateAndDisplayRoute(directionsService, directionsDisplay, org, des);
	showDrivingRoute(directionRoute, route, map);

}

// 路線規劃
function calculateAndDisplayRoute(directionsService, directionsDisplay, org,
		des) {

	directionsService.route({
		origin : new google.maps.LatLng(org.lat, org.lng), // or {lat: -34,
		// lng: 151}
		destination : new google.maps.LatLng(des.lat, des.lng),
		travelMode : google.maps.TravelMode.DRIVING
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			// console.log(JSON.stringify(response));
			var dRoutes = response.routes[0]; // DirectionsRoutes
			var overviewPath = dRoutes.overview_path; // Array<LatLng>
			// var dLeg = dRoutes.legs[0]; //DirectionsLeg
			// var dSteps = dLeg.steps[0]; // DirectionsStep
			// var pathArray = dSteps.path;

			//
			directionRoute = new google.maps.Polyline({
				path : overviewPath,
				strokeColor : '#696969',
				map : map
			});
			// console.log(overviewPath.toString());
//			console.log(JSON.stringify(dRoutes));
//			for (var i = 0; i < dRoutes.legs.length; i++) {
//				var dLeg = dRoutes.legs[0]; 
//				for (var j = 0; j < dLeg.steps.length; j++) {
//					var dSteps = dLeg.steps[j];
//					console.log(dSteps.path.toString());
//				}
//			}
			
			var markers = [];
			var count = 0;
			var image = {
				scaledSize: new google.maps.Size(30, 30),
				url: "./images/ambulance.png"
			};
			for (var i = 0; i < route.length; i++) {
				setTimeout(function() {
					markers.push(new google.maps.Marker({
						position : route[count],
						map : map,
						icon : image
						//animation : google.maps.Animation.DROP
					}))
					markers[count-1<0?0:count-1].setMap(null); // hide pre-marker
					
					//check whether route is changed
					var lat = route[count].lat; 
					var lng = route[count].lng;
					if (google.maps.geometry.poly.isLocationOnEdge(new google.maps.LatLng(lat, lng), directionRoute)) {
					    alert("Relocate!");
					}
					
					count++;
				}, i * 2000);
			}	
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});

}

function showDrivingRoute(directionRoute, route, map) {
	//show driving route

	
}
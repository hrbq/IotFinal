var map;
var route = route1; // choose route here
var markers = [];
var latlng = function(lat, lng) {
	this.lat = lat;
	this.lng = lng;
};
var trafficLight = function(id, lat1, lng1, lat2, lng2) {
	this.id = id;
	this.lat1 = lat1;
	this.lng1 = lng1;
	this.lat2 = lat2;
	this.lng2 = lng2;
}
var trafficLightAll = [
		new trafficLight(1, 25.042069423518775, 121.5244048833847,
				25.04194305960817, 121.52436196804047),
		new trafficLight(2, 25.04201596188016, 121.52433514595032,
				25.04198194082529, 121.52447462081909),
		new trafficLight(3, 25.040655112323545, 121.52400255203247,
				25.040533607164544, 121.52397036552429),
		new trafficLight(4, 25.040577349035658, 121.52393281459808,
				25.040553047998078, 121.52407765388489),
		new trafficLight(5, 25.041097390085774, 121.52226448059082,
				25.040980745556087, 121.52222692966461),
		new trafficLight(6, 25.041019627078317, 121.52216792106628,
				25.040985605747043, 121.52231276035309),
		new trafficLight(7, 25.04246795499936, 121.522656083107,
				25.042365892182563, 121.52262389659882),
		new trafficLight(8, 25.04244365433639, 121.52257561683655,
				25.04240477326565, 121.52271509170532) ];

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

	// == ==
	var org = new google.maps.LatLng(25.042651, 121.524593); // 成功中學
	var des = new google.maps.LatLng(25.041253, 121.520035); // 台大醫院

	document.getElementById('submit').addEventListener('click', function() {
		var redirection = true;
		var routePolyline;
		showDrivingRoute(function(pos, isContinue) {
			async.waterfall([
					function(callback) {
						if (redirection) {
							console.log("==1");
							calculateAndDisplayRoute(directionsService,
									directionsDisplay, org, des, function(
											routePolylineParam) {
										if (routePolyline != null) {
											routePolyline.setMap(null);
										}
										routePolyline = routePolylineParam;
										redirection = false;
										console.log("==1-1");
									});
						}
						callback(null, routePolyline);
					},
					function(routePolylineParam, callback) {
						console.log("==2");
						console.log("==routePolyline" + routePolylineParam);
						// ==check change route==
						if (routePolyline != null
								&& !google.maps.geometry.poly.isLocationOnEdge(pos,
										routePolylineParam, 10e-4)) {
							console.log("==2-1");
							org = pos;
							redirection = true;
						}
						callback("done");
					} ], function(err, result) {
				// result now equals 'done'
			});
	
		});
	});
}

// 路線規劃
function calculateAndDisplayRoute(directionsService, directionsDisplay, org,
		des, callback) {

	directionsService.route({
		origin : org, // or {lat: -34,
		// lng: 151}
		destination : des,
		travelMode : google.maps.TravelMode.DRIVING
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			// console.log(JSON.stringify(response));
			var dRoutes = response.routes[0]; // DirectionsRoutes
			var overviewPath = dRoutes.overview_path; // Array<LatLng>
			// ==To get Polyline for checking whether is the car driving on
			// route==
			var routePolyline = new google.maps.Polyline({
				path : overviewPath,
				strokeColor : '#696969',
				map : map
			});

			callback(routePolyline);
			// console.log(JSON.stringify(overviewPath));
			// var dLeg = dRoutes.legs[0]; //DirectionsLeg
			// var dSteps = dLeg.steps[0]; // DirectionsStep
			// var pathArray = dSteps.path;

			// ==To get the path==
			// var paths = []; //Array<LatLng>
			// for (var i = 0; i < dRoutes.legs.length; i++) {
			// var dLeg = dRoutes.legs[i];
			// for (var j = 0; j < dLeg.steps.length; j++) {
			// var dSteps = dLeg.steps[j];
			// console.log(JSON.stringify(dSteps.path));
			// paths.push(dSteps.path.toString());
			// }
			// }
			// for (var i = 0; i < overviewPath.length; i++) {
			// new google.maps.Marker({
			// position : overviewPath[i],
			// map : map
			// //animation : google.maps.Animation.DROP
			// })
			// }

		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});

}

function showDrivingRoute(callback) {

	// ==show driving route & check route changed==

	var count = 0;
	var image = {
		scaledSize : new google.maps.Size(30, 30),
		url : "./images/ambulance.png"
	};
	for (var i = 0; i < route.length; i++) {
		setTimeout(function() {
			markers.push(new google.maps.Marker({
				position : route[count],
				map : map,
				icon : image
			// animation : google.maps.Animation.DROP
			}));
			markers[count - 1 < 0 ? 0 : count - 1].setMap(null); // hide
			// pre-marker

			// For check whether route is changed
			var lat = route[count].lat;
			var lng = route[count].lng;
			var pos = new google.maps.LatLng(lat, lng);
			count++;
			// ==send socket to wuclass==
//			 testWebSocket();
//			 doSocketSend({"firstName":"John", "lastName":"Doe"});
//			 doSocketClose();

			//==send msg by TCP==
//			createTCP();
//			sendTCP("hello");
//			disconnectTCP();
			if (count > route.length) {
				callback.call(this, pos, false);
				return;
			} else {
				callback.call(this, pos, true);
				return;
			}

		}, i * 1000);
	}

}
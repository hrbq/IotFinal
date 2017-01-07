var map;
var direction1 = ["0","4","9"];
var direction2 = ["0","13","8"];
var route = route1; // choose route here
var routeCar2 = route4;
var direction = direction1; //choose direction here
var directionCar2 = ["1","13","8"];
var wsUri = "ws://10.1.2.168:50001";
var wsUriCar2 = "";



var message =function(rpl, lat, lng, pid, lvl) {
		this.rpl = rpl;
		this.lat = lat;
		this.lng = lng;
		this.pid = pid;
		this.lvl = lvl;
};

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
		var level1 = document.getElementById('level1').value;
		var level2 = document.getElementById('level2').value;
		var redirection = true;
		var routePolyline;
		showDrivingRoute(1,route, level1, function(pos, isContinue) {
			async.waterfall([
					function(callback) {
						if (redirection) {
							calculateAndDisplayRoute(directionsService,
									directionsDisplay, org, des, function(
											routePolylineParam) {
										if (routePolyline != null) {
											routePolyline.setMap(null);
										}
										routePolyline = routePolylineParam;
										redirection = false;
									});
						}
						callback(null, routePolyline);
					},
					function(routePolylineParam, callback) {
						//do nothing
						callback("done");
					} ], function(err, result) {
				// result now equals 'done'
			});
	
		});
		//car 2
		var redirection2 = true;
		showDrivingRoute(2, routeCar2, level2, function(pos, isContinue) {
			var tmpOrg =new google.maps.LatLng(routeCar2[0].lat, routeCar2[0].lng);
			console.log(routeCar2[0].lat.toString()+routeCar2[0].lng.toString());
			if (redirection) {
			calculateAndDisplayRoute(directionsService,
					directionsDisplay, routeCar2[0], des, function(
							routePolylineParam) {
				redirection2 = false;
					});		
			}
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

function showDrivingRoute(pid, route, level, callback) {
	var tmpDirection;
	var tmpWsUri;
	var img;
	if(pid==1){
		tmpDirection = direction;
		tmpWsUri = wsUri;
		img = "./images/ambulance.png"
	}else{
		tmpDirection = directionCar2;
		tmpWsUri = wsUriCar2;
		img = "./images/amb2.png"
	}
	// ==show driving route & check route changed==
	var markers = [];
	var count = 0;
	var image = {
		scaledSize : new google.maps.Size(30, 30),
		url : img
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

//			 testWebSocket(tmpWsUri);
//			 doSocketSend(convertToJson(tmpDirection, pos, pid, level));
//			 doSocketClose();

			if (count > route.length) {
				callback.call(this, pos, false);
				return;
			} else {
				callback.call(this, pos, true);
				return;
			}

		}, i * 1000);
	}
	
	function convertToJson(routeArray, location, pid, level){
		var msg = new message(routeArray, location.lat(), location.lng(), pid, level);
		console.log(JSON.stringify(msg));
		return JSON.stringify(msg);		
	}

}
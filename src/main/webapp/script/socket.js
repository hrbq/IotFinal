var wsUri = "ws://";
var websocket;
function testWebSocket() {
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) {
		onOpen(evt);
	};
	websocket.onclose = function(evt) {
		onClose(evt);
	};
	websocket.onmessage = function(evt) {
		onMessage(evt);
	};
	websocket.onerror = function(evt) {
		onError(evt);
	};
}
function onOpen(evt) {
	console.log("SOCKET CONNECTED");
}
function onClose(evt) {
	console.log("SOCKET DISCONNECTED");
}
function onMessage(evt) {
	concole.log('RESPONSE: ' + evt.data + '');
}
function onError(evt) {
	concole.log('ERROR: ' + evt.data);
}
function doSocketSend(message) {
	websocket.send(message);
}
function doSocketClose(){
	websocket.close();
}
var socketId;
var IP = "10.1.2.168";
var PORT = "50001";

function createTCP() {
	chrome.sockets.tcp.create({}, function(createInfo) {
		chrome.sockets.tcp.connect(createInfo.socketId, IP, PORT, function() {
			socketId = createInfo.socketId;
			console.log("TCP connected");
		});
	});
}

function disconnectTCP() {
	chrome.sockets.tcp.disconnect(socketId, function() {
		console.log("TCP disconnected");
	});
}

function sendTCP(msg) {
	var arrayBuffer = str2ab(msg);
	chrome.sockets.tcp.send(socketId, arrayBuffer, function() {
		console.log("TCP msg sended");
	});
}

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
	var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	var bufView = new Uint16Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

//rpl = []
//lat
//lng
//pid
//lvl

var socket = io("ws://localhost:4000", {
    reconnectionDelayMax: 10000
});

var roomName = "", playerName = "";
var socketInitialized = false;

function toast(message) {
	var x = document.getElementById("snackbar");
	x.className = "show";
	x.innerHTML = message;
	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

function joinRoom() {
	roomName = document.getElementById("room-name").value;
	playerName = document.getElementById("player-name").value;
	if (!roomName || roomName === "" || !playerName || playerName === "") {
		toast("please enter in all fields!");
		return;
	}
	toast(`joining ${roomName}!`)
	socket.emit("join", {
		roomName, playerName
	});

	socketInitialized = true;
    document.getElementById("play-match").style.display = "none";
    document.getElementById("scorebox").style.display = "block";
}

var tellServer = (x, y) => {
	if (socketInitialized) {
		socket.emit("movement", {
			roomName, playerName, x, y
		});
	}
}
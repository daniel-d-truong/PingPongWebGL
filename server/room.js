class Room {
	constructor(name) {
		this.name = name;
		this.filled = false;
		this.players = {};
	}

	join(player) {
		this.players[player.name] = player;
	}
}

class Player {
	constructor(name) {
		this.name = name;
		this.x = this.y = 0;
	}
}

module.exports = {
	Room,
	Player
};
const playerIdx = parseInt(readline());
const nbGames = parseInt(readline());

// game loop
while (true) {
	let playerPositions = [];
	let stunCounts = [];
	for (let i = 0; i < 3; i++) {
		const scoreInfo = readline();
	}
	for (let i = 0; i < nbGames; i++) {
		var inputs = readline().split(' ');
		const gpu = inputs[0];
		const reg0 = parseInt(inputs[1]);
		const reg1 = parseInt(inputs[2]);
		const reg2 = parseInt(inputs[3]);
		const reg3 = parseInt(inputs[4]);
		const reg4 = parseInt(inputs[5]);
		const reg5 = parseInt(inputs[6]);
		const reg6 = parseInt(inputs[7]);

		let playerPosition;
		let stunCount;

		// Determine our player's position and stun count based on playerIdx
		if (playerIdx === 0) {
			playerPosition = reg0;
			stunCount = reg3;
		} else if (playerIdx === 1) {
			playerPosition = reg1;
			stunCount = reg4;
		} else if (playerIdx === 2) {
			playerPosition = reg2;
			stunCount = reg5;
		}

		if (stunCount > 0) {
			// If stunned, we can't move
			console.log('LEFT');
			continue;
		}

		// Determine the obstacles ahead
		let move = 'LEFT'; // Default move
		const trackLength = gpu.length;

		if (playerPosition < trackLength - 1 && gpu[playerPosition + 1] !== '#') {
			move = 'LEFT';
		}
		if (playerPosition < trackLength - 2 && gpu[playerPosition + 1] !== '#' && gpu[playerPosition + 2] !== '#') {
			move = 'DOWN';
		}
		if (playerPosition < trackLength - 3 && gpu[playerPosition + 1] !== '#' && gpu[playerPosition + 2] !== '#' && gpu[playerPosition + 3] !== '#') {
			move = 'RIGHT';
		}
		if (playerPosition < trackLength - 1 && gpu[playerPosition + 1] === '#') {
			move = 'UP';
		}

		console.log(move);
	}
}

const playerIdx = parseInt(readline());
const nbGames = parseInt(readline());
const TRACK_LENGTH = 30;

// Function to simulate the movement
const simulateMove = (position, track, move) => {
	let newPos = position;
	switch (move) {
		case 'RIGHT':
			if (position + 3 < TRACK_LENGTH && track[position + 1] !== '#' && track[position + 2] !== '#' && track[position + 3] !== '#') {
				newPos += 3;
			} else {
				return null;
			}
			break;
		case 'DOWN':
			if (position + 2 < TRACK_LENGTH && track[position + 1] !== '#' && track[position + 2] !== '#') {
				newPos += 2;
			} else {
				return null;
			}
			break;
		case 'LEFT':
			if (position + 1 < TRACK_LENGTH && track[position + 1] !== '#') {
				newPos += 1;
			} else {
				return null;
			}
			break;
		case 'UP':
			if (position + 2 < TRACK_LENGTH && track[position + 1] === '#') {
				newPos += 2;
			} else {
				return null;
			}
			break;
	}
	return newPos;
};

// Function to determine the best move
const determineBestMove = (position, track, stun) => {
	if (stun > 0) {
		return 'LEFT'; // If stunned, no move is effective
	}

	const moves = ['RIGHT', 'DOWN', 'LEFT', 'UP'];
	let bestMove = 'LEFT';
	let bestPos = position;

	moves.forEach(move => {
		const newPos = simulateMove(position, track, move);
		if (newPos !== null && newPos > bestPos) {
			bestPos = newPos;
			bestMove = move;
		}
	});

	return bestMove;
};

// Find the game with the fewest hurdles
const findGameWithFewestHurdles = (tracks) => {
	let minHurdles = Infinity;
	let chosenGame = 0;
	for (let i = 0; i < tracks.length; i++) {
		let hurdleCount = (tracks[i].match(/#/g) || []).length;
		if (hurdleCount < minHurdles) {
			minHurdles = hurdleCount;
			chosenGame = i;
		}
	}
	return chosenGame;
};

// Find the game where we are most advanced
const findMostAdvancedGame = (positions, tracks) => {
	let maxPosition = -1;
	let chosenGame = 0;
	for (let i = 0; i < positions.length; i++) {
		if (tracks[i] !== 'GAME_OVER' && positions[i] > maxPosition) {
			maxPosition = positions[i];
			chosenGame = i;
		}
	}
	return chosenGame;
};

// Main game loop
let focusGame = -1; // No focus game initially

while (true) {
	// Read and ignore the score info
	for (let i = 0; i < 3; i++) {
		readline();
	}

	// Initialize arrays to store game states
	let positions = [];
	let stuns = [];
	let tracks = [];
	let games = [];

	// Read game states for all mini-games
	for (let i = 0; i < nbGames; i++) {
		const inputs = readline().split(' ');
		const gpu = inputs[0];
		const reg0 = parseInt(inputs[1]);
		const reg1 = parseInt(inputs[2]);
		const reg2 = parseInt(inputs[3]);
		const reg3 = parseInt(inputs[4]);
		const reg4 = parseInt(inputs[5]);
		const reg5 = parseInt(inputs[6]);
		const reg6 = parseInt(inputs[7]);

		let position, stunCount;
		if (playerIdx === 0) {
			position = reg0;
			stunCount = reg3;
		} else if (playerIdx === 1) {
			position = reg1;
			stunCount = reg4;
		} else if (playerIdx === 2) {
			position = reg2;
			stunCount = reg5;
		}

		positions.push(position);
		stuns.push(stunCount);
		tracks.push(gpu);
		games.push({ gpu, position, stunCount });
	}

	// Check if we are in a reset turn
	let resetTurn = tracks.every(track => track === 'GAME_OVER');
	if (resetTurn) {
		focusGame = -1; // Reset focus game
	}

	if (focusGame === -1) {
		// Find the game with the fewest hurdles to start
		focusGame = findGameWithFewestHurdles(tracks);
	} else {
		// Check if the current focused game is finished
		if (tracks[focusGame] === 'GAME_OVER') {
			// Find the game with the fewest hurdles where we can still compete
			let minHurdlesGame = findGameWithFewestHurdles(tracks);
			if (tracks[minHurdlesGame] === 'GAME_OVER') {
				// If all games with fewer hurdles are finished, focus on the most advanced game
				focusGame = findMostAdvancedGame(positions, tracks);
			} else {
				focusGame = minHurdlesGame;
			}
		}
	}

	// Determine the best move for the focus game
	let bestMove = determineBestMove(positions[focusGame], tracks[focusGame], stuns[focusGame]);
	console.log(bestMove);
}

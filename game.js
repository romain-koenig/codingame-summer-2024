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

// Determine which game to focus on next based on medals
const determineNextFocusGame = (medals) => {
	let minPoints = Infinity;
	let chosenGame = 0;
	for (let i = 0; i < medals.length; i++) {
		let points = medals[i].gold * 3 + medals[i].silver;
		if (points < minPoints) {
			minPoints = points;
			chosenGame = i;
		}
	}
	return chosenGame;
};

// Main game loop
let focusGame = -1; // No focus game initially
let medals = Array(nbGames).fill().map(() => ({ gold: 0, silver: 0, bronze: 0 }));

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
		focusGame = determineNextFocusGame(medals); // Determine the next focus game based on medals
	}

	if (focusGame === -1) {
		// Find the game with the fewest hurdles to start
		focusGame = findGameWithFewestHurdles(tracks);
	} else {
		// Check if the current focused game is finished
		if (tracks[focusGame] === 'GAME_OVER') {
			// Update medals
			let position = positions[focusGame];
			let medal = medals[focusGame];
			if (position >= TRACK_LENGTH) {
				medal.gold++;
			} else if (position >= TRACK_LENGTH - 1) {
				medal.silver++;
			} else {
				medal.bronze++;
			}
			medals[focusGame] = medal;

			// Find the next focus game based on medals
			focusGame = determineNextFocusGame(medals);
		}
	}

	// Determine the best move for the focus game
	let bestMove = determineBestMove(positions[focusGame], tracks[focusGame], stuns[focusGame]);

	// If we have an advance, play conservatively
	if (positions[focusGame] > Math.max(...positions.filter((_, idx) => idx !== focusGame)) + 3) {
		// Check other games for possible jumps
		for (let i = 0; i < nbGames; i++) {
			if (i !== focusGame && tracks[i] !== 'GAME_OVER') {
				let potentialMove = determineBestMove(positions[i], tracks[i], stuns[i]);
				if (potentialMove === 'UP') {
					bestMove = 'UP';
					break;
				}
			}
		}
	}

	console.log(bestMove);
}

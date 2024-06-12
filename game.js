const playerIdx = parseInt(readline());
const nbGames = parseInt(readline());
const TRACK_LENGTH = 30;
const SIMULATION_DEPTH = 5;

while (true) {
	// Read and ignore the score info
	for (let i = 0; i < 3; i++) {
		readline();
	}

	// Initialize arrays to store game states
	let positions = [];
	let stuns = [];
	let tracks = [];

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
	}

	// Function to simulate the movement
	const simulateMove = (position, track, move) => {
		let newPos = position;
		let score = 0;
		switch (move) {
			case 'RIGHT':
				if (position + 3 < TRACK_LENGTH && track[position + 1] !== '#' && track[position + 2] !== '#' && track[position + 3] !== '#') {
					newPos += 3;
					score = 3;
				} else {
					score = -1;
				}
				break;
			case 'DOWN':
				if (position + 2 < TRACK_LENGTH && track[position + 1] !== '#' && track[position + 2] !== '#') {
					newPos += 2;
					score = 2;
				} else {
					score = -1;
				}
				break;
			case 'LEFT':
				if (position + 1 < TRACK_LENGTH && track[position + 1] !== '#') {
					newPos += 1;
					score = 1;
				} else {
					score = -1;
				}
				break;
			case 'UP':
				if (position + 2 < TRACK_LENGTH && track[position + 1] === '#') {
					newPos += 2;
					score = 2;
				} else {
					score = -1;
				}
				break;
		}
		return { newPos, score };
	};

	// Simulate and evaluate future positions
	const evaluateMoves = (positions, stuns, tracks) => {
		const moves = ['LEFT', 'DOWN', 'RIGHT', 'UP'];
		let bestMove = 'LEFT';
		let bestScore = -Infinity;

		moves.forEach(move => {
			let totalScore = 0;
			for (let i = 0; i < nbGames; i++) {
				if (stuns[i] > 0) {
					continue; // Skip if stunned
				}
				let { newPos, score } = simulateMove(positions[i], tracks[i], move);
				if (score >= 0) {
					// Further simulate for additional depth
					for (let depth = 1; depth < SIMULATION_DEPTH; depth++) {
						let futureMove = moves[Math.floor(Math.random() * moves.length)];
						let futureResult = simulateMove(newPos, tracks[i], futureMove);
						if (futureResult.score >= 0) {
							newPos = futureResult.newPos;
							score += futureResult.score;
						} else {
							break;
						}
					}
					totalScore += score;
				}
			}
			if (totalScore > bestScore) {
				bestScore = totalScore;
				bestMove = move;
			}
		});
		return bestMove;
	};

	// Choose the best move based on simulation
	let bestMove = evaluateMoves(positions, stuns, tracks);

	console.log(bestMove);
}

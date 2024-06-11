const playerIdx = parseInt(readline());
const nbGames = parseInt(readline());

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

	// Determine the best move for each game
	let moveScores = { LEFT: 0, DOWN: 0, RIGHT: 0, UP: 0 };

	for (let i = 0; i < nbGames; i++) {
		const position = positions[i];
		const stunCount = stuns[i];
		const track = tracks[i];

		if (stunCount > 0) {
			moveScores['LEFT']++;
			continue;
		}

		const trackLength = track.length;
		if (position + 3 < trackLength && track[position + 1] !== '#' && track[position + 2] !== '#' && track[position + 3] !== '#') {
			moveScores['RIGHT'] += 3; // Prefer RIGHT if the next 3 steps are safe
		}
		if (position + 2 < trackLength && track[position + 1] !== '#' && track[position + 2] !== '#') {
			moveScores['DOWN'] += 2; // Prefer DOWN if the next 2 steps are safe
		}
		if (position + 1 < trackLength && track[position + 1] !== '#') {
			moveScores['LEFT'] += 1; // Prefer LEFT if the next step is safe
		}
		if (position + 1 < trackLength && track[position + 1] === '#') {
			moveScores['UP'] += 2; // Prefer UP to jump over an immediate hurdle
		}
	}

	// Determine the best move based on the highest score
	let bestMove = 'LEFT';
	let maxScore = moveScores['LEFT'];
	if (moveScores['RIGHT'] > maxScore) {
		bestMove = 'RIGHT';
		maxScore = moveScores['RIGHT'];
	}
	if (moveScores['DOWN'] > maxScore) {
		bestMove = 'DOWN';
		maxScore = moveScores['DOWN'];
	}
	if (moveScores['UP'] > maxScore) {
		bestMove = 'UP';
		maxScore = moveScores['UP'];
	}

	console.log(bestMove);
}

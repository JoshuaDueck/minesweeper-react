import MineField from './MineField.js';
import { useState } from 'react';
import './App.css';

const MAX_WIDTH = 30;
const MAX_HEIGHT = 30;

function App() {
	const WIDTH = Math.random() * (MAX_WIDTH - 10) + 10
	const HEIGHT = Math.random() * (MAX_HEIGHT - 10) + 10

	let initialCells = [];

	for (let i = 0; i < HEIGHT; i++) {
		let row = [];
		for (let j = 0; j < WIDTH; j++) {
			row.push(0);
		}
		initialCells.push(row);
	}

	const [cells, setCells] = useState(initialCells);
	const [gameRunning, setGameRunning] = useState(false);

	const handleBeginGame = (x, y) => {
		if (!gameRunning) {
			console.log("Beginning game!\nLaying bombs around ("+x+", "+y+")");
	
			let bombsToSet = (HEIGHT * WIDTH) / 4;
			let newCells = [...cells];
	
			while (bombsToSet > 0) {
				for (let i = 0; i < HEIGHT; i++) {
					for (let j = 0; j < WIDTH; j++) {
						if (bombsToSet > 0) {
							if (Math.random() < 0.1 && (i <= x-2 || i > x+2 || j <= y-2 || j > y+2)) {
								console.log("Setting a bomb at ("+i+", "+j+")");
								newCells[i][j] = -1;
								bombsToSet--;
							}
						}
					}
				}
			}
	
			setCells(newCells);
			setGameRunning(true);
			calculateCellNumbers();
		}
	};

	const calculateCellNumbers = () => {
		let newCells = [...cells];
		for (let i = 0; i < HEIGHT; i++) {
			for (let j = 0; j < WIDTH; j++) {
				if (newCells[i][j] === -1) {
					/*  i-1,j-1 | i-1,j | i-1,j+1
						i,j-1   |  i,j  | i,j+1
						i+1,j-1 | i+1,j | i+1,j+1
					*/

					if (j < WIDTH-1) {
						// the rightmost tile
						if (newCells[i][j+1] !== -1) {
							newCells[i][j+1] += 1;
						}

						if (i > 0 && newCells[i-1][j+1] !== -1) {
							// the top right tile
							newCells[i-1][j+1] += 1;
						}

						if (i < HEIGHT-1 && newCells[i+1][j+1] !== -1) {
							// the bottom right tile
							newCells[i+1][j+1] += 1;
						}
					}

					if (j > 0) {
						// the leftmost tile
						if (newCells[i][j-1] !== -1){
							newCells[i][j-1] += 1;
						}

						if (i > 0 && newCells[i-1][j-1] !== -1) {
							// the top left tile
							newCells[i-1][j-1] += 1;
						}

						if (i < HEIGHT-1 && newCells[i+1][j-1] !== -1) {
							// the bottom left tile
							newCells[i+1][j-1] += 1;
						}
					}

					if (i < HEIGHT-1 && newCells[i+1][j] !== -1) {
						// the bottom tile
						newCells[i+1][j] += 1;
					}

					if (i > 0 && newCells[i-1][j] !== -1) {
						// the top tile 
						newCells[i-1][j] += 1;
					}
				}
			}
		}

		setCells(newCells);
	}

	return (
		<div className="App">
			<div className="title">Minesweeper</div>
			<div className="game-window">
				<MineField cells={cells} beginGame={(x, y) => handleBeginGame(x, y)} gameRunning={gameRunning}/>
			</div>
		</div>
	);
}

export default App;

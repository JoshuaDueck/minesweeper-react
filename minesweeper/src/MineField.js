import { useState } from 'react';
import Cell from './Cell.js';
import './App.css'

function MineField(props) {
    let hm = []; // Hide map
    let fm = []; // Flag map
    let surroundingIndices = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]; // Contains offsets for each surrounding index.

    // Initialize the hide map and flag map.
    for (let i = 0; i < props.cells.length; i++) {
        let hm_row = [];
        let fm_row = [];
        for (let j = 0; j < props.cells[i].length; j++) {
            hm_row.push(true);
            fm_row.push(false);
        }
        hm.push(hm_row);
        fm.push(fm_row);
    }

    const [hideMap, setHideMap] = useState(hm);
    const [flagMap, setFlagMap] = useState(fm);

    function logCellInfo(x, y) {
        console.log("Clicked ("+x+", "+y+")");
    }

    // TODO: Add checking for flags, when revealing, use icons for flagged but incorrect
    const revealAllCells = () => {
        const newHideMap = [...hideMap];

        for (let i = 0; i < hideMap.length; i++) {
            for (let j = 0; j < hideMap[i].length; j++) {
                newHideMap[i][j] = false;
            }
        }

        setHideMap(newHideMap);
    }

    const handleCellClick = (x, y) => {
        logCellInfo(x, y);
        // This will check if the game has begun yet, then will reveal the cell recursively.
        if (!props.gameRunning) {
            props.beginGame(x, y);
        }

        if (!hideMap[x][y]) {
            quickReveal(x, y);
        }

        revealCells(x, y);
    }

    // Checks for the number of surrounding flags.
    // If the number of surrounding flags is equal to the current
    const quickReveal = (x, y) => {
        console.log("Revealing around ("+x+", "+y+")");
        let flagCount = 0;
        for (let i = 0; i < surroundingIndices.length; i++) {
            if (x+surroundingIndices[i][0] < props.cells.length-1 && x+surroundingIndices[i][0] > 0 && flagMap[x+surroundingIndices[i][0]][y+surroundingIndices[i][1]]) {
                flagCount++;
            }
        }

        console.log("Flag Count = "+flagCount+", ... number = "+props.cells[x][y].number);
        if (flagCount !== 0 && flagCount === props.cells[x][y]) {
            console.log("GOT HERE!");
            for (let i = 0; i < surroundingIndices.length; i++) {
                revealCells(x+surroundingIndices[i][0], y+surroundingIndices[i][1]);
            }
        }
    }

    const revealCells = (x, y) => {
        // This will recursively reveal all adjacent cells.
        if (x >= 0 &&
            x < props.cells.length &&
            y >= 0 && y < props.cells[x].length &&
            !flagMap[x][y]) {
            if (props.cells[x][y] === 0) {
                console.log("Clicked an empty tile.");
                // reveal all surrounding cells that have not been revealed (recursive, send newHideMap?)
                const newHideMap = [...hideMap];
                newHideMap[x][y] = false;
                setHideMap(newHideMap);

                console.log(hideMap);

                // We really only need to check for the first value, since the second value should be falsy (if undefined).
                if (x < props.cells.length-1 && hideMap[x+1][y-1]) {
                    revealCells(x+1, y-1);
                }
                if (x < props.cells.length-1 && hideMap[x+1][y]) {
                    revealCells(x+1, y);
                }
                if (x < props.cells.length-1 && hideMap[x+1][y+1]) {
                    revealCells(x+1, y+1);
                }
                if (hideMap[x][y-1]) {
                    revealCells(x, y-1);
                }
                if (hideMap[x][y+1]) {
                    revealCells(x, y+1);
                }
                if (x > 0 && hideMap[x-1][y-1]) {
                    revealCells(x-1, y-1);
                }
                if (x > 0 && hideMap[x-1][y]) {
                    revealCells(x-1, y);
                }
                if (x > 0 && hideMap[x-1][y+1]) {
                    revealCells(x-1, y+1);
                }
            } else if (props.cells[x][y] === -1) {
                // bomb, end game.
                alert("BOOOOOOOOOOOM!");
                revealAllCells();
            } else {
                // reveal the cell.
                const newHideMap = [...hideMap];
                newHideMap[x][y] = false;
                setHideMap(newHideMap);
            }
        }
    }

    const handleRightClick = (event, x, y) => {
        event.preventDefault();
        logCellInfo(x, y);

        if (hideMap[x][y]) {
            const newFlagMap = [...flagMap];
            newFlagMap[x][y] = !newFlagMap[x][y];
            setFlagMap(newFlagMap);
        }
    }
    
    return (
        <table className="field-table">
            <tbody>
                {props.cells.map((row, i) => {
                    return (
                        <tr key={i} className="cell-row">
                            {row.map((cell, j) => {
                                return (
                                    <Cell
                                        key={[i,j]}
                                        coords={[i,j]}
                                        number={cell}
                                        handleCellClick={() => handleCellClick(i, j)}
                                        handleRightClick={(e) => handleRightClick(e, i, j)}
                                        hidden={hideMap[i][j]}
                                        flagged={flagMap[i][j]}
                                    />
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default MineField;
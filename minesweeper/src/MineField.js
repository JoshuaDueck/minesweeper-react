import { useState, useEffect } from 'react';
import Cell from './Cell.js';
import './App.css'

function MineField(props) {
    let hm = []; // Hide map
    let fm = []; // Flag map 

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

    const revealAllTiles = () => {
        for (let i = 0; i < hideMap.length; i++) {
            for (let j = 0; j < hideMap[i].length; j++) {
                hideMap[i][j] = false;
            }
        }
    }

    const handleCellClick = (x, y) => {
        logCellInfo(x, y);
        // This will check if the game has begun yet, then will reveal the cell recursively.
        if (!props.gameRunning) {
            props.beginGame(x, y); // The issue that is currently happening is that the state is not updating in time before this function is
                                   // called again. I think we need to finish the function, then call another function to continue the
                                   // game? I am not sure. We immediately recurse within this "handleCellTrigger", which should probably
                                   // not be the case. I would imagine we could turn this into a different function before moving on to reveal
                                   // the cells. I dunno.

            // Debug: reveal all tiles
            // revealAllTiles();
        }

        revealCells(x, y);
    }

    // We are currently having some issues when it comes to revealing cells.
    // I have found that there are particular issues with revealing tiles to the left (y-1) of the current tile.
    // Not sure what that means.
    const revealCells = (x, y) => {
        // This will recursively reveal all adjacent cells.
        if (x >= 0 && x < props.cells.length && y >= 0 && y < props.cells[x].length) {
            if (props.cells[x][y] === 0) {
                console.log("Clicked an empty tile.");
                // reveal all surrounding cells that have not been revealed (recursive, send newHideMap?)
                const newHideMap = [...hideMap];
                newHideMap[x][y] = false;
                setHideMap(newHideMap);

                console.log(hideMap);

                // The issue is that we are hitting the end (then adding 1 to x, falling off the end).
                // We really only need to check for the first value, since the second value should be falsy (if undefined).
                if (x < props.cells.length-1 && hideMap[x+1][y-1]) {
                    revealCells(x+1, y-1);
                    // hideMap[x+1][y-1] = false;
                }
                if (x < props.cells.length-1 && hideMap[x+1][y]) {
                    revealCells(x+1, y);
                    // hideMap[x+1][y] = false;
                }
                if (x < props.cells.length-1 && hideMap[x+1][y+1]) {
                    revealCells(x+1, y+1);
                    // hideMap[x+1][y+1] = false;
                }
                if (hideMap[x][y-1]) {
                    revealCells(x, y-1);
                    // hideMap[x][y-1] = false;
                }
                if (hideMap[x][y+1]) {
                    revealCells(x, y+1);
                    // hideMap[x][y+1] = false;
                }
                if (x > 0 && hideMap[x-1][y-1]) {
                    revealCells(x-1, y-1);
                    // hideMap[x-1][y-1] = false;
                }
                if (x > 0 && hideMap[x-1][y]) {
                    revealCells(x-1, y);
                    // hideMap[x-1][y] = false;
                }
                if (x > 0 && hideMap[x-1][y+1]) {
                    revealCells(x-1, y+1);
                    // hideMap[x-1][y+1] = false;
                }
            } else if (props.cells[x][y] === -1) {
                // bomb, end game.
                alert("BOOOOOOOOOOOM!");
            } else {
                // reveal the cell.
                const newHideMap = [...hideMap];
                newHideMap[x][y] = false;
                setHideMap(newHideMap);
            }
        }
    }

    const handleCellTrigger = (x, y) => {
        logCellInfo(x, y);



        
    };

    const handleRightClick = (event, x, y) => {
        event.preventDefault();
        logCellInfo(x, y);

        const newFlagMap = [...flagMap];
        newFlagMap[x][y] = !newFlagMap[x][y];

        setFlagMap(newFlagMap);
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
                                        key={(i,j)}
                                        coords={(i,j)}
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
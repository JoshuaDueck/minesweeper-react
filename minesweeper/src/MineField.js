import { useState } from 'react';
import Cell from './Cell.js';
import './App.css'


function MineField(props) {
    let hm = [];
    let fm = [];
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

    const handleCellTrigger = (x, y) => {
        logCellInfo(x, y);

        if (!props.gameRunning) {
            props.beginGame(x, y);

            // Debug: reveal all tiles
            // revealAllTiles();
        }

        if (props.cells[x][y] === 0) {
            // reveal all surrounding cells that have not been revealed (recursive, send newHideMap?)
            hideMap[x][y] = false;
            if (hideMap[x+1][y-1]) {
                // handleCellTrigger(x+1, y-1, true);
                hideMap[x+1][y-1] = false;
            }
            if (hideMap[x+1][y]) {
                // handleCellTrigger(x+1, y, true);
                hideMap[x+1][y] = false;
            }
            if (hideMap[x+1][y+1]) {
                // handleCellTrigger(x+1, y+1, true);
                hideMap[x+1][y+1] = false;
            }
            if (hideMap[x][y-1]) {
                // handleCellTrigger(x, y-1, true);
                hideMap[x][y-1] = false;
            }
            if (hideMap[x][y+1]) {
                // handleCellTrigger(x, y+1, true);
                hideMap[x][y+1] = false;
            }
            if (hideMap[x-1][y-1]) {
                // handleCellTrigger(x-1, y-1, true);
                hideMap[x-1][y-1] = false;
            }
            if (hideMap[x-1][y]) {
                // handleCellTrigger(x-1, y, true);
                hideMap[x-1][y] = false;
            }
            if (hideMap[x-1][y+1]) {
                // handleCellTrigger(x-1, y+1, true);
                hideMap[x-1][y+1] = false;
            }
        } else if (props.cells[x][y] === -1) {
            // bomb, end game.
            alert("BOMB!");
        } else {
            // reveal the cell.
            // if (x > 0 && x < props.cells.length-1 && y > 0 && y < props.cells[x].length-1) {
            //     const newHideMap = [...hideMap];
            //     newHideMap[x][y] = false;
            //     setHideMap(newHideMap);
            // }
            props.cells[x][y] = false;
        }
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
                                        handleCellTrigger={() => handleCellTrigger(i, j)}
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
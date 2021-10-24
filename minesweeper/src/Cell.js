import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';

function Cell(props) {
    if (props.flagged) {
        return (
            <td key={props.coords} className="hidden-cell" onContextMenu={(e) => props.handleRightClick(e, props.coords[0], props.coords[1])}><FontAwesomeIcon icon={faFlag} /></td>
        );
    } else if (props.hidden) {
        return (
            <td key={props.coords} className="hidden-cell" onClick={() => props.handleCellClick(props.coords[0], props.coords[1])} onContextMenu={(e) => props.handleRightClick(e, props.coords[0], props.coords[1])}></td>
        );
    } else {
        if (props.number === -1) {
            return (
                <td key={props.coords} className="cell" onClick={() => props.handleCellClick(props.coords[0], props.coords[1], false)} onContextMenu={(e) => props.handleRightClick(e, props.coords[0], props.coords[1])}><FontAwesomeIcon icon={faBomb} /></td>
            );
        } else {
            return (
                <td key={props.coords} className="cell" onClick={() => props.handleCellClick(props.coords[0], props.coords[1], false)} onContextMenu={(e) => props.handleRightClick(e, props.coords[0], props.coords[1])}>{props.number}</td>
            );
        }
    }
}

export default Cell;
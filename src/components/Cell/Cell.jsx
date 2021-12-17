// import { useEffect } from "react"
import './cell.css'

function Cell({cell, position, board, gameState})
{
    const x=position.x;
    const y=position.y;
    
    const isChoosed = gameState.state === 'choosedCellToTravelFrom' && x === gameState.position.x && y === gameState.position.y
    
    const cellColor=((y%2===0&&x%2===0)||(y%2!==0&&x%2!==0))?"CornflowerBlue":"LightBlue";

    return <div className="cell" onClick={cell.onClick} style={{background: (isChoosed &&'gray')||(cellColor)}}>
        <div className="circle" style={{backgroundColor: cell.team}}></div>
    </div>
}

export default Cell
/** */


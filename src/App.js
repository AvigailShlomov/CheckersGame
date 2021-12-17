import { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Cell from "./components/Cell/Cell";

function App() {
  const [board, setBoard] = useState(createBoard());
  const [gameState, setGameState] = useState({
    team: "NoTeam",
    state: "beforeChoose",
    position: null,
  });
  const [teamWin, setTeamWin] = useState(null);
  const [message, setMessage] = useState("");

  const chooseCell = (position) => {
    setGameState({ ...gameState, state: "choosedCellToTravelFrom", position });
  };
  //update location and del prev
  const travelToCell = (cellToTravelFrom, cellToTravelTo) => {
    const newBoard = [...board];
    newBoard[cellToTravelTo.y][cellToTravelTo.x] =
      board[cellToTravelFrom.y][cellToTravelFrom.x];

    newBoard[cellToTravelFrom.y][cellToTravelFrom.x] = getNullCell();
    setBoard(newBoard);
    setGameState((lastState) => {
      return {
        team: lastState.team === "white" ? "red" : "white",
        state: "beforeChoose",
        position: null,
      };
    });
  };
  //"delete" cell to eat
  const eatCell = (cellToTravelFrom, cellToTravelTo, cellToEat) => {
    const newBoard = [...board];
    newBoard[cellToEat.y][cellToEat.x] = getNullCell();

    setBoard(newBoard);
    travelToCell(cellToTravelFrom, cellToTravelTo);
  };

  const calcMessage = () => {
    setMessage(`${gameState.team} turn`);
  };

  //stages: beforeChoose, choosedCellToTravelFrom, choosedCellToTravelTo

  const calcCells = () => {
    let newBoard = board;
    if (gameState.state === "beforeChoose") {
      newBoard = board.map((currRow, y) => {
        return currRow.map((currCell, x) => {
          let onClick;
          if (currCell.team === gameState.team) {
            onClick = () => chooseCell({ x, y });
          } else {
            onClick = () => setMessage("cant choose this cell");
          }
          return { ...currCell, onClick, isChoosed: false };
        });
      });
    }

    if (gameState.state === "choosedCellToTravelFrom") {
      newBoard = board.map((currRow, y) => {
        return currRow.map((currCell, x) => {
          let onClick = () => setMessage("this is NOT a good spot");
          return { ...currCell, onClick };
        });
      });

      const teamSign = gameState.team === "white" ? -1 : 1;
      //calc right alacson 1 2 places forward
      const rightCloseCandidate =
        newBoard[gameState.position.y + teamSign]?.[
          gameState.position.x - teamSign
        ];
      const leftCloseCandidate =
        newBoard[gameState.position.y + teamSign]?.[
          gameState.position.x + teamSign
        ];
      const rightCloseCandidateNext =
        newBoard[gameState.position.y + teamSign * 2]?.[
          gameState.position.x - teamSign * 2
        ];
      const leftCloseCandidateNext =
        newBoard[gameState.position.y + teamSign * 2]?.[
          gameState.position.x + teamSign * 2
        ];

      //check first:
      if (rightCloseCandidate?.team === null) {
        console.log("right opp");
        rightCloseCandidate.onClick = () =>
          travelToCell(gameState.position, {
            y: gameState.position.y + teamSign,
            x: gameState.position.x - teamSign,
          });
      } else if (
        rightCloseCandidateNext?.team === null &&
        rightCloseCandidate.team !== gameState.team
      ) {
        rightCloseCandidateNext.onClick = () =>
          eatCell(
            gameState.position,
            {
              y: gameState.position.y + teamSign * 2,
              x: gameState.position.x - teamSign * 2,
            },
            {
              y: gameState.position.y + teamSign,
              x: gameState.position.x - teamSign,
            }
          );
        console.log("can eat right");
        //can eat
      }

      if (leftCloseCandidate?.team === null) {
        console.log("left opp");
        leftCloseCandidate.onClick = () =>
          travelToCell(gameState.position, {
            y: gameState.position.y + teamSign,
            x: gameState.position.x + teamSign,
          });
      } else if (
        leftCloseCandidateNext?.team === null &&
        leftCloseCandidate.team !== gameState.team
      ) {
        leftCloseCandidateNext.onClick = () =>
          eatCell(
            gameState.position,
            {
              y: gameState.position.y + teamSign * 2,
              x: gameState.position.x + teamSign * 2,
            },
            {
              y: gameState.position.y + teamSign,
              x: gameState.position.x + teamSign,
            }
          );
        console.log("can eat right");
        //can eat
      }
    }
    // lastBoard.current = board;

    setBoard(newBoard);
  };

  useEffect(() => {
    if (teamWin) {
      alert(`${teamWin} won`);
    }
  }, [teamWin]);

  useEffect(() => {
    calcMessage();
    calcCells();

    const isHaveReds = board.some((currRow) =>
      currRow.some((currCell) => currCell.team === "red")
    );
    const isHaveWhites = board.some((currRow) =>
      currRow.some((currCell) => currCell.team === "white")
    );
    if (!isHaveReds) setTeamWin("white");
    if (!isHaveWhites) setTeamWin("red");
  }, [gameState]);

  return (
    <div className="App">
      <button
        onClick={() => {
          setGameState({ ...gameState, team: "white" });
          setBoard(createBoard);
        }}
      >
        Start Game
      </button>
      <p>{message}</p>

      <div className="board">
        {board.map((currRow, y) => (
          <div className="row" key={y}>
            {currRow.map((currCell, x) => (
              <Cell
                key={x}
                cell={currCell}
                position={{ x, y }}
                board={board}
                gameState={gameState}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// function createLittleBoard() {
//   let result = [];

//   for (let i = 2; i < 6; i++) {
//     let row = [];
//     for (let j = 1; j < 6; j++) {
//       if (((i === 0 || i === 2) && j % 2 === 0) || (i === 1 && j % 2 !== 0)) {
//         row.push({
//           team: "red",
//           role: "soldier",
//           onClick: () => "",
//           isChoosed: false,
//         });
//       } else if (
//         ((i === 5 || i === 7) && j % 2 !== 0) ||
//         (i === 6 && j % 2 === 0)
//       ) {
//         row.push({
//           team: "white",
//           role: "soldier",
//           onClick: () => "",
//           isChoosed: false,
//         });
//       } else {
//         row.push(getNullCell());
//       }
//     }
//     result.push(row);
//   }
//   return result;
// }

//create board and stones
function createBoard() {
  let result = [];

  for (let i = 0; i < 8; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      if (((i === 0 || i === 2) && j % 2 === 0) || (i === 1 && j % 2 !== 0)) {
        row.push({
          team: "red",
          role: "soldier",
          onClick: () => "",
          isChoosed: false,
        });
      } else if (
        ((i === 5 || i === 7) && j % 2 !== 0) ||
        (i === 6 && j % 2 === 0)
      ) {
        row.push({
          team: "white",
          role: "soldier",
          onClick: () => "",
          isChoosed: false,
        });
      } else {
        row.push(getNullCell());
      }
    }
    result.push(row);
  }
  return result;
}

function getNullCell() {
  return {
    team: null,
    role: null,
    onClick: () => "",
    isChoosed: false,
  };
}

export default App;
// if (currCell.team !== gameState.team) {
//   //it means that the cell is null/oponent
//   if (!currCell.team) {
//     //check yemin-kad small-kad

//     if (
//       (gameState.position.x + 1 === x ||
//         gameState.position.x - 1 === x) &&
//       y ===
//         gameState.position.y + (gameState.team === "white" ? -1 : 1)
//     ) {
//       console.log("scanerio");
//       onClick = () => {
//         setMessage("this is a good spot");
//         travelToCell(gameState.position, { x, y });
//       };
//     }

//     //able to travel cell
//   } else {
//   }
// } else {
//   //not able to travel cell
// }

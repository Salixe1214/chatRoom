import {useState} from "react";

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill([null])]);
    const [currentMove, setCurrentMove] = useState(0);
    const [sortAscOrder, setSortAscOrder] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove][0];

    function handlePlay(nextSquares, rowId) {
        const nextHistory = [...history.slice(0, currentMove + 1), [nextSquares, [Math.floor(rowId/3), rowId % 3]]];
        console.log("Next square: " + nextSquares);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        const rowId = sortAscOrder? move: history.length - move - 1;
        let description;
        if (rowId === 1) {
            description = "Go to first move"
        } else if (rowId === 2) {
            description = "Go to 2nd move"
        } else if (rowId === 3) {
            description = "Go to 3rd move"
        } else if (rowId > 0) {
            description = "Go to " + rowId + "th move";
        } else {
            description = "Reset the game";
        }

        return (
            <li key={rowId} value={rowId}>
                <button onClick={() => jumpTo(rowId)}>{description + " (" + history[rowId][1] + ")"}</button>
            </li>
        );
    });

    function getMove() {
        return "You are at move " + currentMove;
    }

    function myFunction() {
        // Get the checkbox
        let checkBox = document.getElementById("invert");

        setSortAscOrder(!(checkBox.checked === true));
    }

    console.log(currentSquares);

    return (<div>
            <div className="moveNumber">{getMove()}</div>
            <div className="game">
                <div className="game-board">
                    < Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
                </div>
            </div>
            <div className="game-info">
                <label>Invert <mark>History</mark></label>
                <input type="checkbox" id="invert" onClick={myFunction}/>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)[0]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares, i);
    }

    const [winner, winningRow] = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext? "X" : "O");
    }

    let rowElements = [];
    for (let i = 0; i < 3; i++) {
        let rowElement = []
        for (let j = 0; j < 3; j++) {
            const rowId = (3 * i) + j;
            const isWinning = winningRow.indexOf(rowId) > -1;
            rowElement.push(<Square value={squares[rowId]} onSquareClick={() => handleClick(rowId)} isWinning={isWinning}/>);
        }
        rowElements.push(<div className="board-row">{rowElement}</div>);
    }

    return (
        <>
            <div className="status">{status}</div>
            {rowElements}
        </>
    );
}

function Square({ value, onSquareClick, isWinning = false }) {
    return (
        <button
            className="square"
            onClick={onSquareClick}
        >
            {isWinning? <mark>{value}</mark>: value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, []];
}

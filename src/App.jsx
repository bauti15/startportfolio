import { useState } from "react";
import {Square} from "./componentes/Square";
import { TURNS, WINNER_COMBOS } from "./componentes/constantes";


function App() {
  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse (boardFromStorage)
    return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null); // null es que no hay ganador , false es que hay un empate

  const checkWinner = (boarToCheck) => {
    //reviusamos todas las combinaciones ganadoras
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boarToCheck[a] && // 0 = x i o
        boarToCheck[a] == boarToCheck[b] &&
        boarToCheck[a] == boarToCheck[c]
      ) {
        return boarToCheck[a];
      }
    }
    //si no hay ganador
    return null;
  };
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  };
  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    //no actualizar esta posicion si ya tiene un valor
    if (board[index] || winner) return;

    //actualizar tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //cambiar el turno
    const newTurn = turn == TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //guardar aqui partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn',turn)
    //revisar si tenemos ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };

  return (
    <main className="board">
      <h1>tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn == TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn == TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner == false ? "empate" : "Gano:"}</h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;

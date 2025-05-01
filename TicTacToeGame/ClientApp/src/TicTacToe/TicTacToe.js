import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicTacToe.css';

const TicTacToe = () => {
  const [game, setGame] = useState({
    id: null,
    board: Array(9).fill(null),
    isXNext: true,
    winner: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Создаем новую игру при загрузке компонента
  useEffect(() => {
    createNewGame();
  }, []);

  const createNewGame = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/game');
      const newGame = response.data;
      setGame({
        id: newGame.id,
        board: JSON.parse(newGame.board),
        isXNext: newGame.isXNext,
        winner: newGame.winner
      });
      setError(null);
    } catch (err) {
      setError('Не удалось создать новую игру');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (index) => {
    // Игнорируем клик, если клетка уже заполнена или есть победитель
    if (game.board[index] || game.winner || loading) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = game.isXNext ? 'X' : 'O';

    const winner = calculateWinner(newBoard);
    const updatedGame = {
      board: JSON.stringify(newBoard),
      isXNext: !game.isXNext,
      winner: winner
    };

    try {
      setLoading(true);
      await axios.put(`/api/game/${game.id}`, updatedGame);
      setGame({
        ...game,
        board: newBoard,
        isXNext: !game.isXNext,
        winner: winner
      });
    } catch (err) {
      setError('Не удалось обновить игру');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    // Проверяем на ничью
    if (squares.every(square => square !== null)) {
      return 'Ничья';
    }

    return null;
  };

  const renderSquare = (index) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {game.board[index]}
      </button>
    );
  };

  const getStatus = () => {
    if (game.winner === 'Ничья') {
      return 'Игра закончилась вничью!';
    } else if (game.winner) {
      return `Победитель: ${game.winner}`;
    } else {
      return `Сейчас ходит: ${game.isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="game-container">
      <h1>Крестики-нолики</h1>
      {error && <div className="error">{error}</div>}
      
      <div className="status">{getStatus()}</div>
      
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      
      <button 
        className="new-game-button" 
        onClick={createNewGame}
        disabled={loading}
      >
        Новая игра
      </button>
    </div>
  );
};

export default TicTacToe;
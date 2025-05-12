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
      console.log("Отправка запроса на создание новой игры");
      
      // Используем полный URL для устранения проблем с маршрутизацией
      const response = await axios.post('/api/game');
      console.log("Ответ от сервера:", response.data);
      
      const newGame = response.data;
      setGame({
        id: newGame.id,
        board: JSON.parse(newGame.board),
        isXNext: newGame.isXNext,
        winner: newGame.winner
      });
      setError(null);
    } catch (err) {
      console.error("Ошибка при создании игры:", err);
      setError('Не удалось создать новую игру: ' + (err.message || 'Неизвестная ошибка'));
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
    
    // Проверяем, установлен ли id игры
    if (!game.id) {
      console.error("ID игры не установлен. Невозможно обновить игру.");
      setError("ID игры не установлен. Пожалуйста, начните новую игру.");
      return;
    }

    try {
      setLoading(true);
      console.log(`Отправка хода на сервер. ID игры: ${game.id}`);
      
      const updatedGame = {
        board: JSON.stringify(newBoard),
        isXNext: !game.isXNext,
        winner: winner
      };
      
      await axios.put(`/api/game/${game.id}`, updatedGame);
      
      setGame({
        ...game,
        board: newBoard,
        isXNext: !game.isXNext,
        winner: winner
      });
      setError(null);
    } catch (err) {
      console.error("Ошибка при обновлении игры:", err);
      setError('Не удалось сделать ход: ' + (err.message || 'Неизвестная ошибка'));
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
    let btnClass = "square btn";
    
    // Добавляем разные стили в зависимости от содержимого клетки
    if (game.board[index] === 'X') {
      btnClass += " btn-primary";
    } else if (game.board[index] === 'O') {
      btnClass += " btn-danger";
    } else {
      btnClass += " btn-light";
    }

    return (
      <button className={btnClass} onClick={() => handleClick(index)}>
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

  // Определить стиль для статуса игры на основе состояния
  const getStatusBadgeClass = () => {
    if (game.winner === 'X') return 'bg-primary';
    if (game.winner === 'O') return 'bg-danger';
    if (game.winner === 'Ничья') return 'bg-warning';
    return game.isXNext ? 'bg-primary' : 'bg-danger';
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-dark text-white text-center">
              <h1 className="mb-0">Крестики-нолики</h1>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="text-center mb-4">
                <span className={`badge ${getStatusBadgeClass()} fs-5 p-2`}>
                  {getStatus()}
                </span>
                {game.id && (
                  <div className="mt-2 text-muted">
                    <small>ID игры: {game.id}</small>
                  </div>
                )}
              </div>
              
              <div className="board mx-auto">
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
              
              <div className="text-center mt-4">
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={createNewGame}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Загрузка...
                    </>
                  ) : (
                    'Новая игра'
                  )}
                </button>
              </div>
            </div>
            <div className="card-footer text-center text-muted">
              <small>ASP.NET Core 8 + PostgreSQL + React + Bootstrap 5</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
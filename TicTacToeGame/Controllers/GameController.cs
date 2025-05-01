using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TicTacToeGame.Data;
using TicTacToeGame.Models;

namespace TicTacToeGame.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GameController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Game
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            return await _context.Games.OrderByDescending(g => g.CreatedAt).ToListAsync();
        }

        // GET: api/Game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(int id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }

        // POST: api/Game
        [HttpPost]
        public async Task<ActionResult<Game>> CreateGame()
        {
            // Создание новой игры с пустой доской (массив из 9 null элементов)
            string emptyBoard = JsonSerializer.Serialize(new string?[9]);
            var game = new Game
            {
                Board = emptyBoard,
                IsXNext = true,
                Winner = null
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }

        // PUT: api/Game/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] GameUpdateDto update)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            // Обновляем доску
            game.Board = update.Board;
            game.IsXNext = update.IsXNext;
            game.Winner = update.Winner;
            game.UpdatedAt = DateTime.UtcNow;

            _context.Entry(game).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class GameUpdateDto
    {
        public string Board { get; set; } = string.Empty;
        public bool IsXNext { get; set; }
        public string? Winner { get; set; }
    }
}
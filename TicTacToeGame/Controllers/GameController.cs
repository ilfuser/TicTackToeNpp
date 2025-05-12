using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TicTacToeGame.Data;
using TicTacToeGame.Models;

namespace TicTacToeGame.Controllers
{
    [ApiController]
    //[Route("api/[controller]")]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GameController> _logger;

        public GameController(ApplicationDbContext context, ILogger<GameController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Game
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            _logger.LogInformation("GetGames called");
            return await _context.Games.OrderByDescending(g => g.CreatedAt).ToListAsync();
        }

        // GET: api/Game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(int id)
        {
            _logger.LogInformation($"GetGame called with id: {id}");
            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                _logger.LogWarning($"Game with id {id} not found");
                return NotFound();
            }

            return game;
        }

        // POST: api/Game
        [HttpPost]
        public async Task<ActionResult<Game>> CreateGame()
        {
            _logger.LogInformation("CreateGame called");

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

            _logger.LogInformation($"Created game with id: {game.Id}");
            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }

        // PUT: api/Game/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] GameUpdateDto update)
        {
            _logger.LogInformation($"UpdateGame called with id: {id}");

            if (id <= 0)
            {
                _logger.LogWarning($"Invalid game id: {id}");
                return BadRequest("Invalid game id");
            }

            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                _logger.LogWarning($"Game with id {id} not found");
                return NotFound();
            }

            // Обновляем доску
            game.Board = update.Board;
            game.IsXNext = update.IsXNext;
            game.Winner = update.Winner;
            game.UpdatedAt = DateTime.UtcNow;

            _context.Entry(game).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Game with id {id} updated successfully");
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
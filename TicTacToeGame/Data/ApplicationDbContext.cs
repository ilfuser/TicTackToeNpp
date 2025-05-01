using Microsoft.EntityFrameworkCore;
using TicTacToeGame.Models;

namespace TicTacToeGame.Data {
    public class ApplicationDbContext : DbContext {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
            {                
            }

            public DbSet<Game> Games { get; set; }
    }
}
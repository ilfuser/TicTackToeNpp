using System;
using System.ComponentModel.DataAnnotations;

namespace TicTacToeGame.Models 
{
    public class Game
    {
        [Key]
        public int Id { get; set; }
        public string Board { get; set; } = string.Empty; // JSON представление доски
        public bool IsXNext { get; set; } = true;
    }
}
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieApi.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { get; set; }

        [Required, MaxLength(500)]
        public string Comment { get; set; }

        [Required]
        public int Rating { get; set; }

        public Movie Movie { get; set; }
        public UserAccount User { get; set; }
    }
}

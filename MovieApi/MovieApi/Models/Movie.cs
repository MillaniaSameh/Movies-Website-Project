using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApi.Models
{
    public class Movie
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MovieId { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; }

        [Required, MaxLength(500)]
        public string Poster { get; set; }

        [Required]
        public int ReleaseYear { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public IList<MovieCast> MovieCast { get; set; }
    }
}

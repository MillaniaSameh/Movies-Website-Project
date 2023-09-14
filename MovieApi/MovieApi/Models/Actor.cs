using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieApi.Models
{
    public class Actor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ActorId { get; set; }

        [Required, MaxLength(50)]
        public string ActorName { get; set; }

        public IList<MovieCast> MovieCast { get; set; }
    }
}

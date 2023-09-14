using MovieApi.Models;
using System.Text.Json.Serialization;

namespace MovieApi.ViewModels
{
    public class MovieViewModel
    {
        [JsonPropertyName("movieId")]
        public int MovieId { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = "";

        [JsonPropertyName("description")]
        public string Description { get; set; } = "";

        [JsonPropertyName("poster")]
        public string Poster { get; set; } = "";

        [JsonPropertyName("releaseYear")]
        public int ReleaseYear { get; set; }

        [JsonPropertyName("reviews")]
        public List<ReviewViewModel> Reviews { get; set; } = new();

        [JsonPropertyName("actors")]
        public List<string> MovieCast { get; set; } = new();
    }
}

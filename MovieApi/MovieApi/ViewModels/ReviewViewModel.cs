using System.Text.Json.Serialization;

namespace MovieApi.ViewModels
{
    public class ReviewViewModel
    {
        [JsonPropertyName("comment")]
        public string Comment { get; set; } = "";

        [JsonPropertyName("rating")]
        public int Rating { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; } = "";
    }
}

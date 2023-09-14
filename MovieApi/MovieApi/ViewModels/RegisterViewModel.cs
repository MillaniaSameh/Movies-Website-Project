using System.Text.Json.Serialization;

namespace MovieApi.ViewModels
{
    public class RegisterViewModel
    {
        [JsonPropertyName("username")]
        public string Username { get; set; } = "";

        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        [JsonPropertyName("password")]
        public string Password { get; set; } = "";
    }
}

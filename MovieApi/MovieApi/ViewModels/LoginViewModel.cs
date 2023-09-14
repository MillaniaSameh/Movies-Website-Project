using System.Text.Json.Serialization;

namespace MovieApi.ViewModels
{
    public class LoginViewModel
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        [JsonPropertyName("password")]
        public string Password { get; set; } = "";
    }
}

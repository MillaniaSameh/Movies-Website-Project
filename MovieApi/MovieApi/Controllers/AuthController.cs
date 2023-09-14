using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using MovieApi.Models;
// using Microsoft.EntityFrameworkCore;
using MovieApi.ViewModels;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace MovieApi.Controllers
{
    public class AuthController : Controller
    {
        private MovieContext _movieContext = new MovieContext();

        //private readonly MovieContext _movieContext;

        //public AuthController(MovieContext movieContext)
        //{
        //    _movieContext = movieContext;
        //}

        private async Task SignIn (string username)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, username),
                new Claim(ClaimTypes.Name, username),
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync(claimsPrincipal);
        }

        [HttpPost("/register")]
        public async Task<IActionResult> Register()
        {
            var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
            var user = JsonSerializer.Deserialize<RegisterViewModel>(requestBody);

            if (user == null)
            {
                return BadRequest("Request failed. Please Try again later.");
            }

            if (string.IsNullOrEmpty(user.Username) ||
                string.IsNullOrEmpty(user.Email) ||
                string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Username, email and password are required.");
            }

            var foundUser = _movieContext.UserAccount.Where(u => u.Email == user.Email).FirstOrDefault();

            if (foundUser != null)
            {
                return Unauthorized("Email already exists. Please use another one.");
            }

            var passwordHasher = new PasswordHasher<string>();
            string hashedPassword = passwordHasher.HashPassword(null, user.Password);

            var newUser = new UserAccount()
            {
                Username = user.Username,
                Email = user.Email,
                Password = hashedPassword,
                Reviews = new List<Review>()
            };

            _movieContext.UserAccount.Add(newUser);
            _movieContext.SaveChanges();

            await SignIn(user.Username);

            return Ok();
        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login()
        {
            var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
            var user = JsonSerializer.Deserialize<LoginViewModel>(requestBody);

            if (user == null)
            {
                return BadRequest("Request failed. Please Try again later.");
            }

            if (string.IsNullOrEmpty(user.Email) ||
                string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Email address and password are required.");
            }

            var foundUser = _movieContext.UserAccount.Where(u => u.Email == user.Email).FirstOrDefault();

            if (foundUser != null)
            {
                var passwordHasher = new PasswordHasher<string>();
                var passwordVerificationResult = passwordHasher.VerifyHashedPassword(null, foundUser.Password, user.Password);

                if (passwordVerificationResult == PasswordVerificationResult.Success)
                {
                    await SignIn(foundUser.Username);
                    return Ok(JsonSerializer.Serialize(foundUser.Username));
                }
                else
                {
                    return Unauthorized("Incorrect email or password.");
                }
            }

            return BadRequest("These credentials does not exist. Use the correct email or password.");
        }

        [HttpGet("/logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }
    }
}

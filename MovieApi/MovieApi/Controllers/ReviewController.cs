using Microsoft.AspNetCore.Mvc;
using MovieApi.Models;
using MovieApi.ViewModels;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace MovieApi.Controllers
{
    [Authorize]
    public class ReviewController : Controller
    {
        private MovieContext _movieContext = new MovieContext();

        [HttpPost("/add-review")]
        public async Task<IActionResult> AddReview(int movieId)
        {
            var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
            var review = JsonSerializer.Deserialize<ReviewViewModel>(requestBody);

            if (review == null || string.IsNullOrEmpty(review.Comment))
            {
                return BadRequest("All fileds are required.");
            }

            var movie = _movieContext.Movie
                .Include(movie => movie.Reviews)
                .Include(movie => movie.MovieCast)
                .Where(m => m.MovieId == movieId)
                .FirstOrDefault();

            if (movie == null)
            {
                return Unauthorized("Movie doesn't exist.");
            }

            var author = _movieContext.UserAccount.Where(u => u.Username == review.Username).FirstOrDefault();

            if (author == null)
            {
                return Unauthorized("You are not an authorized user.");
            }

            var newReview = new Review()
            {
                Comment = review.Comment,
                Rating = review.Rating,
                User = author,
                Movie = movie
            };

            movie.Reviews.Add(newReview);
            _movieContext.Review.Add(newReview);

            _movieContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("/delete-review")]
        public IActionResult DeleteMovie(int reviewId)
        {
            var foundReview = _movieContext.Review.Where(r => r.ReviewId == reviewId).FirstOrDefault();

            if (foundReview == null)
                return BadRequest("Review does not exist.");
            else
                _movieContext.Review.Remove(foundReview);

            _movieContext.SaveChanges();

            return Ok();
        }
    }
}

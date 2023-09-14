using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieApi.Models;
using MovieApi.ViewModels;
using System.Net;
using System.Text.Json;

namespace MovieApi.Controllers
{
    [Authorize]
    public class MovieController : Controller
    {
        private MovieContext _movieContext = new MovieContext();
        private readonly int itemsPerPage = 10;

        [HttpPost("/add-movie")]
        public async Task<IActionResult> AddMovie()
        {
            var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
            var movie = JsonSerializer.Deserialize<MovieViewModel>(requestBody);

            if (movie == null ||
                string.IsNullOrEmpty(movie.Title) ||
                string.IsNullOrEmpty(movie.Description) ||
                string.IsNullOrEmpty(movie.Poster) ||
                movie.ReleaseYear < 1800 ||
                movie.ReleaseYear > 2060 ||
                movie.MovieCast.Count < 1)
            {
                return BadRequest("All fileds are required.");
            }

            var foundmovie = _movieContext.Movie.Where(m => m.Title == movie.Title).FirstOrDefault();
            if (foundmovie != null)
            {
                return Unauthorized($"Movie already exists with id {foundmovie.MovieId}. You can edit it.");
            }

            var newMovie = new Movie()
            {
                Title = movie.Title,
                Description = movie.Description,
                Poster = movie.Poster,
                ReleaseYear = movie.ReleaseYear,
                Reviews = new List<Review>(),
                MovieCast = new List<MovieCast>()
            };  

            // add actor if he doesn't exist in the database
            // then add that actor to the movie cast (many to many relationship)
            foreach (var actor in movie.MovieCast)
            {
                var foundActor = _movieContext.Actor.Where(a => a.ActorName == actor).FirstOrDefault();

                if (foundActor == null)
                {
                    var newActor = new Actor() { ActorName = actor };

                    _movieContext.Actor.Add(newActor);

                    foundActor = newActor;
                }

                var movieCast = new MovieCast() { Movie = newMovie, Actor = foundActor };

                newMovie.MovieCast.Add(movieCast);
            }

            _movieContext.Movie.Add(newMovie);
            _movieContext.SaveChanges();

            foreach (var review in movie.Reviews)
            {
                var author = _movieContext.UserAccount.Where(u => u.Username == review.Username).FirstOrDefault();
                var newReview = new Review()
                {
                    Comment = review.Comment,
                    Rating = review.Rating,
                    User = author ?? new UserAccount()
                };

                newMovie.Reviews.Add(newReview);
                _movieContext.Review.Add(newReview);
            }

            _movieContext.SaveChanges();

            return Ok();
        }

        [HttpGet("/get-movies")]
        public IActionResult GetAllMovies(int pageNumber)
        {
            if (pageNumber == 0)
                pageNumber = 1;

            int start = (pageNumber - 1) * itemsPerPage;
            int end = itemsPerPage;

            var movies = _movieContext.Movie
                .Include(movie => movie.Reviews)
                .Include(movie => movie.MovieCast)
                .Select(movie => new
                {
                    movie.MovieId,
                    movie.Title,
                    movie.Description,
                    movie.Poster,
                    movie.ReleaseYear,
                    Reviews = movie.Reviews.Select(review => new { review.ReviewId, review.User.Username, review.Comment, review.Rating }).ToList(),
                    Actors = movie.MovieCast.Select(actor => actor.Actor.ActorName).ToList(),
                })
                .ToList();

            if (start >= movies.Count)
                return Ok();

            if(movies.Count < pageNumber * itemsPerPage)
                end = movies.Count - (itemsPerPage * (pageNumber - 1));

            return Ok(movies.GetRange(start, end));
        }

        [HttpPut("/update-movie")]
        public async Task<IActionResult> UpdateMovie()
        {
            var requestBody = await new StreamReader(Request.Body).ReadToEndAsync();
            Console.WriteLine(requestBody);

            var movie = JsonSerializer.Deserialize<MovieViewModel>(requestBody);

            if (movie == null)
            {
                return BadRequest("Something went wrong. Please try again later.");
            }

            if (string.IsNullOrEmpty(movie.Title) ||
                string.IsNullOrEmpty(movie.Description) ||
                movie.ReleaseYear < 1800 ||
                movie.ReleaseYear > 2060 ||
                movie.MovieCast.Count < 1)
            {
                return BadRequest("All fileds are required.");
            }

            var movieQuery = _movieContext.Movie
                .Include(movie => movie.Reviews)
                .Include(movie => movie.MovieCast)
                .Where(m => m.MovieId == movie.MovieId);

            var foundMovie = movieQuery.FirstOrDefault();

            var actorsList = movieQuery
                .Select(movie => movie.MovieCast.Select(actor => actor.Actor.ActorName))
                .SelectMany(x => x)
                .ToList();

            if (foundMovie == null)
            {
                return BadRequest("Movie does not exist.");
            }
            else
            {
                foundMovie.Title = movie.Title;
                foundMovie.Description = movie.Description;
                foundMovie.ReleaseYear = movie.ReleaseYear;

                if(!string.IsNullOrEmpty(movie.Poster))
                {
                    foundMovie.Poster = movie.Poster;
                }

                foreach (var actor in movie.MovieCast)
                {
                    var foundActor = _movieContext.Actor.Where(a => a.ActorName == actor).FirstOrDefault();

                    if (foundActor == null)
                    {
                        var newActor = new Actor() { ActorName = actor };

                        _movieContext.Actor.Add(newActor);

                        var movieCast = new MovieCast() { Movie = foundMovie, Actor = newActor };
                        
                        foundMovie.MovieCast.Add(movieCast);
                    }
                    else if(!actorsList.Contains(actor))
                    {
                        // actor found -> but was never assign to that movie, assign him
                        var movieCast = new MovieCast() { Movie = foundMovie, Actor = foundActor };
                        foundMovie.MovieCast.Add(movieCast);
                    }
                    else
                    {
                        // actor found -> if the actor actually is a cast -> do nothing
                        actorsList.Remove(actor);
                    }
                }

                // remove deleted actors
                foreach (var actor in actorsList)
                {
                    var cast = movieQuery
                        .Select(movie => movie.MovieCast.Where(cast => cast.Actor.ActorName == actor).FirstOrDefault())
                        .FirstOrDefault();

                    if (cast != null)
                        foundMovie.MovieCast.Remove(cast);
                }
            }

            _movieContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("/delete-movie")]
        public IActionResult DeleteMovie(int movieId)
        {
            var foundMovie = _movieContext.Movie.Where(m => m.MovieId == movieId).FirstOrDefault();

            if (foundMovie == null)
                return BadRequest("Movie does not exist.");
            else
                _movieContext.Movie.Remove(foundMovie);

            _movieContext.SaveChanges();

            return Ok();
        }


        [HttpGet("/get-movie")]
        public IActionResult GetMovieById(int movieId)
        {
            var foundMovie = _movieContext.Movie
                .Include(movie => movie.Reviews)
                .Include(movie => movie.MovieCast)
                .Select(movie => new
                {
                    movie.MovieId,
                    movie.Title,
                    movie.Description,
                    movie.Poster,
                    movie.ReleaseYear,
                    Reviews = movie.Reviews.Select(review => new { review.ReviewId, review.User.Username, review.Comment, review.Rating }).ToList(),
                    Actors = movie.MovieCast.Select(actor => actor.Actor.ActorName).ToList(),
                })
                .Where(m => m.MovieId == movieId).FirstOrDefault();

            if (foundMovie == null)
                return BadRequest("Movie does not exist.");

            return Ok(foundMovie);
        }

        [HttpGet("/search-movies")]
        public IActionResult SearchForMovies(string searchTerm)
        {
            var movies = _movieContext.Movie
                .Include(movie => movie.Reviews)
                .Include(movie => movie.MovieCast)
                .Select(movie => new
                {
                    movie.MovieId,
                    movie.Title,
                    movie.Description,
                    movie.Poster,
                    movie.ReleaseYear,
                    Reviews = movie.Reviews.Select(review => new { review.ReviewId, review.User.Username, review.Comment, review.Rating }).ToList(),
                    Actors = movie.MovieCast.Select(actor => actor.Actor.ActorName).ToList(),
                });

            if (string.IsNullOrEmpty(searchTerm))
                return Ok(movies.ToList());
            else
                return Ok(movies.Where(m => m.Title.Contains(searchTerm)).ToList());
        }

        [HttpGet("/get-actors")]
        public IActionResult GetAllActors()
        {
            var actors = _movieContext.Actor.Select(actor => actor.ActorName).ToList();
            return Ok(actors);
        }

        [HttpPost("/upload-poster")]
        public async Task<IActionResult> uploadPoster()
        {
            var formCollection = await Request.ReadFormAsync();

            var file = formCollection.Files.First();

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;

            var uploadsFolder = Path.Combine("D:\\Learning Phase\\Movies Website Project\\movies-platform\\src\\assets", "images");

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            string path = Path.Combine("images", uniqueFileName);

            return Ok(JsonSerializer.Serialize(uniqueFileName));
        }
    }
}
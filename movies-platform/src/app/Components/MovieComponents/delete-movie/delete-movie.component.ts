import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/Services/movie.service';

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.css']
})

export class DeleteMovieComponent {
  @Input() movieId!: number | null;
  @Input() movieTitle!: string;
  userMessage: string;

  constructor(private movieService: MovieService, private router: Router) {
    this.userMessage = "Are you sure you want to delete the movie?";
  }

  deleteMovie() {
    this.movieService.deleteMovie(this.movieId ?? 0).subscribe({
      next: () => {
        this.movieId = null;
        this.userMessage = "Movie deleted successfully!";
      }, 
      error: () => {
        this.movieId = null;
        this.userMessage = "Something went wrong! Please try again later."
      }
    });
  }

  returnToHome() {
    this.router.navigate(["/Home"]);
  }
}

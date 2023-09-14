import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMovie } from 'src/app/Interfaces/imovie';
import { MovieService } from 'src/app/Services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { IReview } from 'src/app/Interfaces/ireview';
import { ReviewService } from 'src/app/Services/review.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit {
  movie!: IMovie;
  ratings: number[][] = [];
  reviewsForm: FormGroup;
  reviewToBeDeleted!: IReview | null;
  userMessage: string;
  requestSent: boolean = false;
  error: boolean = false;

  constructor(private movieService: MovieService, private reviewService: ReviewService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.reviewsForm = this.fb.group({
      reviews: this.fb.group({
        comment: ['', Validators.required],
        rating: [0],
        username: [localStorage.getItem('username')]
      })
    });

    this.userMessage = "Are you sure you want to delete your review?";
  }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.paramMap.get('mid') ?? "");
    this.requestSent = true;
    
    setTimeout(() => {
      this.fetchMovie(id);
      this.requestSent = false;
    }, 500)
  }

  get currentUser() {
    return localStorage.getItem('username');
  }

  // ----------------- Movie functions ----------------- //

  fetchMovie(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (response) => {
        this.error = false;
        this.movie = response;
        this.movie.reviews.forEach(element => {
          this.ratings.push(Array(element.rating).fill(0))
        });
      },
      error: () => {
        this.error = true;
      }
    });
  }

  // ----------------- Review functions ----------------- //

  addReview() {
    let review: IReview = <IReview>this.reviewsForm.get('reviews')?.value;
    let id = this.movie?.movieId ?? 0;

    this.reviewService.addReview(review, id).subscribe({
      next: () => {
        this.ratings = [];
        this.movie?.reviews.push(review);

        this.movie?.reviews.forEach(element => {
          this.ratings.push(Array(element.rating).fill(0))
        });

        this.fetchMovie(id);

        this.reviewsForm.patchValue({
          reviews: {
            comment: '',
            rating: 0,
            username: localStorage.getItem('username')
          }
        })
        this.reviewsForm.markAsUntouched();
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(this.reviewToBeDeleted?.reviewId ?? 0).subscribe({
      next: () => {
        if (!this.reviewToBeDeleted)
          return;

        let ind = this.movie?.reviews.indexOf(this.reviewToBeDeleted) ?? 0;

        this.movie?.reviews.splice(ind, 1);
        this.ratings.splice(ind, 1);

        this.reviewToBeDeleted = null;
        this.userMessage = "Review deleted successfully!";
      },
      error: () => {
        this.reviewToBeDeleted = null;
        this.userMessage = "Something went wrong. Please try again later!"
      }
    });
  }

  setReviewToDelete(review: IReview) {
    this.reviewToBeDeleted = review;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMovie } from 'src/app/Interfaces/imovie';
import { IReview } from 'src/app/Interfaces/ireview';
import { MovieService } from 'src/app/Services/movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})

export class AddMovieComponent implements OnInit{
  movieDataForm: FormGroup;
  movieId!: number;
  hideAddButton: boolean = false;
  errorOccurred: boolean = false;
  addRequestSent: boolean = false;
  editRequestSent: boolean = false;
  fetchRequestSent: boolean = false;
  imagePath!: string;

  constructor(private fb: FormBuilder, private movieService: MovieService, private route: ActivatedRoute, private router: Router) {
    this.movieDataForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      releaseYear: ['', [Validators.required, Validators.pattern('^(([1][89][0-9][0-9])|(20[0-5][0-9])|(2060))$')]],
      poster: ['', [Validators.required]],
      actors: this.fb.array([this.fb.control('', Validators.required)]),
      reviews: this.fb.group({
        comment: [''],
        rating: [0],
        username: [localStorage.getItem("username")]
      })
    });
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('mid');  

    if(id != null) {
      this.hideAddButton = true;
      this.fetchRequestSent = true;
      setTimeout(() => {
        this.movieService.getMovieById(parseInt(id ?? "")).subscribe({
          next: (response) => {
            let movie: IMovie = response;
            this.movieDataForm.patchValue({
              title: movie.title,
              description: movie.description,
              releaseYear: movie.releaseYear,
              actors: movie.actors
            });
            let actors = this.movieDataForm.controls['actors'] as FormArray;
            movie.actors.forEach(actorName => {
              actors.push(this.fb.control(actorName, Validators.required));
            });
            actors.removeAt(0);
            this.fetchRequestSent = false;
          },
          error: () => {
            this.errorOccurred = true;
          }
        });
      }, 500);
    }
  }

  getImagePath(path: string) {
    this.imagePath = path;
  }

  updateMovieValid() {
    return !this.movieDataForm.get('title')?.valid
        || !this.movieDataForm.get('description')?.valid
        || !this.movieDataForm.get('releaseYear')?.valid
        || !this.movieDataForm.get('actors')?.valid;
  }

  // ----------------- Add-Edit movie ----------------- //

  addMovie() {
    let movieData: IMovie = <IMovie>this.movieDataForm.value;
    movieData.poster = this.imagePath;
    movieData.reviews = [];

    let review = this.movieDataForm.controls['reviews'] as FormGroup;
    if(review.value['comment'] != "")
    {
      movieData.reviews.push(<IReview>review.value);
    }

    this.addRequestSent = true;

    setTimeout(() => {
      this.movieService.addMovie(movieData).subscribe({
        next: () => {
          this.router.navigate(["/Home"]);
        },
        error: (error) => {
          const matches = error.message.match(/\b\d+\b/);
          this.movieId = parseInt(matches[0]);
          this.addRequestSent = false;
        }
      });
    }, 1000)
  }

  updateMovie() {
    let id = this.route.snapshot.paramMap.get('mid');  

    if(id == null) {
      return;
    }

    let movieData: IMovie = <IMovie>this.movieDataForm.value;
    movieData.poster = this.imagePath;
    movieData.movieId = parseInt(id);
    movieData.reviews = [];

    this.editRequestSent = true;

    setTimeout(() => {
      this.movieService.updateMovie(movieData).subscribe({
        next: () => {
          this.router.navigate(["/Movie", id]);
        },
        error: (error) => {
          const matches = error.message.match(/\b\d+\b/);
          this.movieId = parseInt(matches[0]);
        }
      });
    }, 1000);
  }
}
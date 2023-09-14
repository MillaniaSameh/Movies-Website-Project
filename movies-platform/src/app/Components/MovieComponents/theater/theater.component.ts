import { Component, HostListener, OnInit } from '@angular/core';
import { MovieService } from 'src/app/Services/movie.service';
import { IMovie } from 'src/app/Interfaces/imovie';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css']
})

export class TheaterComponent implements OnInit {
  movies!: IMovie[];
  searchForm: FormGroup;
  requestSent: boolean = false;
  error: boolean = false;
  pageNumber: number = 1;
  isLoadingMovies: boolean = false;
  noMoreMovies: boolean = false;

  constructor(private fb: FormBuilder, private movieService: MovieService) {
    this.searchForm = this.fb.group({
      term: [''],
    });
  }

  ngOnInit() {
    this.requestSent = true;
    setTimeout(() => {
      this.fetchMovies()
      this.requestSent = false;
    }, 500);
  }

  search() {
    this.movieService.searchForMovies(this.searchForm.get('term')?.value).subscribe({
      next: (response) => {
        this.movies = response;
      },
      error: () => {
        this.error = true;
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const windowHeight: number = window.innerHeight;
    const documentHeight: number = document.documentElement.scrollHeight;
    const scrollTop: number = window.screenY || document.documentElement.scrollTop || document.body.scrollTop;

    const height: number = documentHeight - scrollTop;
    const endScreen: boolean =  (height >= (windowHeight - 2)) && (height <= (windowHeight + 2));
    
    if(endScreen && !this.noMoreMovies) {
      this.isLoadingMovies = true;
      setTimeout(() => {
        this.fetchMovies();
        this.isLoadingMovies = false;
      }, 1000)
    }
  }

  fetchMovies() {
    this.movieService.getAllMovies(this.pageNumber).subscribe({
      next: (response) => {
        if(this.pageNumber == 1) {
          this.movies = response;
        } else if(response != null) {
          this.movies = [...this.movies , ...response];
        } else {
          this.noMoreMovies = true;
        }
        this.pageNumber += 1;
      },
      error: () => {
        this.error = true;
      }
    });
  }
}

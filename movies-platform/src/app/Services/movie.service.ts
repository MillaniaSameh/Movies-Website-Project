import { Injectable } from '@angular/core';
import { IMovie } from '../Interfaces/imovie';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MovieService {

  private readonly APIURL: string = 'https://localhost:7265';
  private httpOption;

  constructor(private httpClient: HttpClient) {
    this.httpOption = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
      withCredentials: true
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.error));
  }


  addMovie(movie: IMovie): Observable<string> {
    return this.httpClient
      .post<string>(`${this.APIURL}/add-movie`, JSON.stringify(movie), this.httpOption)
      .pipe(
        catchError(this.handleError)
      )
  }

  getAllMovies(pageNumber: number): Observable<IMovie[]> {
    return this.httpClient.get<IMovie[]>(`${this.APIURL}/get-movies?pageNumber=${pageNumber}`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  updateMovie(movie: IMovie): Observable<string> {
    return this.httpClient
    .put<string>(`${this.APIURL}/update-movie`, JSON.stringify(movie), this.httpOption)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteMovie(id: number) {
    return this.httpClient.delete(`${this.APIURL}/delete-movie?movieId=${id}`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  getMovieById(id: number) {
    return this.httpClient.get<IMovie>(`${this.APIURL}/get-movie?movieId=${id}`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  searchForMovies(term: string): Observable<IMovie[]> {
    return this.httpClient.get<IMovie[]>(`${this.APIURL}/search-movies?searchTerm=${term}`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllActors(): Observable<String[]> {
    return this.httpClient.get<String[]>(`${this.APIURL}/get-actors`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadImage(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient
      .post<string>(`${this.APIURL}/upload-poster`, formData, {withCredentials: true})
      .pipe(
        catchError(this.handleError)
      )
  }
}

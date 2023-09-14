import { Injectable } from '@angular/core';
import { IReview } from '../Interfaces/ireview';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReviewService {

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

  addReview(review: IReview, id: number) {
    return this.httpClient
      .post<string>(`${this.APIURL}/add-review?movieId=${id}`, JSON.stringify(review), this.httpOption)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteReview(id: number) {
    return this.httpClient.delete(`${this.APIURL}/delete-review?reviewId=${id}`, this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}

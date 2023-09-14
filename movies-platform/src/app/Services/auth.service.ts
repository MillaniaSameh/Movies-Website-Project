import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { ILogin } from '../Interfaces/ilogin';
import { IRegister } from '../Interfaces/iregister';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedSubject: BehaviorSubject<boolean>;
  private readonly APIURL: string = 'https://localhost:7265';
  private httpOption;

  constructor(private router: Router, private httpClient: HttpClient) {
    this.isLoggedSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn);
    this.httpOption = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        // Authorization: 'my-token'
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

  login(userInput: ILogin): Observable<string> {
    return this.httpClient
      .post<string>(`${this.APIURL}/login`, JSON.stringify(userInput), this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  logout() {
    return this.httpClient
    .get(`${this.APIURL}/logout`, this.httpOption)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  register(userInput: IRegister): Observable<string>  {
    return this.httpClient
      .post<string>(`${this.APIURL}/register`, JSON.stringify(userInput), this.httpOption)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  get isUserLoggedIn(): boolean {
    return localStorage.getItem("username")? true : false;
  }

  getLoggedStatus(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }
}

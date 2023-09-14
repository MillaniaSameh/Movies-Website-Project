import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { MovieCardComponent } from './Components/MovieComponents/movie-card/movie-card.component';
import { TheaterComponent } from './Components/MovieComponents/theater/theater.component';
import { AddMovieComponent } from './Components/MovieComponents/add-movie/add-movie.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { LoginComponent } from './Components/AuthPages/login/login.component';
import { RegisterComponent } from './Components/AuthPages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './Services/auth.service';
import { MovieDetailsComponent } from './Components/MovieComponents/movie-details/movie-details.component';
import { MovieService } from './Services/movie.service';
import { DeleteMovieComponent } from './Components/MovieComponents/delete-movie/delete-movie.component';
import { ReviewMovieComponent } from './Components/MovieComponents/AddEditMovieComponents/review-movie/review-movie.component';
import { ActorsListComponent } from './Components/MovieComponents/AddEditMovieComponents/actors-list/actors-list.component';
import { GeneralInfoComponent } from './Components/MovieComponents/AddEditMovieComponents/general-info/general-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieCardComponent,
    TheaterComponent,
    AddMovieComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    MovieDetailsComponent,
    DeleteMovieComponent,
    ReviewMovieComponent,
    ActorsListComponent,
    GeneralInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    RatingModule,
    PaginatorModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    MovieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieCardComponent } from './Components/MovieComponents/movie-card/movie-card.component';
import { TheaterComponent } from './Components/MovieComponents/theater/theater.component';
import { LoginComponent } from './Components/AuthPages/login/login.component';
import { RegisterComponent } from './Components/AuthPages/register/register.component';
import { authGuard } from './Guards/auth.guard';
import { MovieDetailsComponent } from './Components/MovieComponents/movie-details/movie-details.component';
import { AddMovieComponent } from './Components/MovieComponents/add-movie/add-movie.component';

const routes: Routes = [
  { path: "", redirectTo: "/Home", pathMatch: "full" },
  { path: "Login", component: LoginComponent },
  { path: "Register", component: RegisterComponent },
  { path: "Home", component: TheaterComponent, canActivate: [authGuard] },
  { path: "AddMovie", component: AddMovieComponent, canActivate: [authGuard] },
  { path: "AddMovie/:mid", component: AddMovieComponent, canActivate: [authGuard] },
  { path: "Movie/:mid", component: MovieDetailsComponent, canActivate: [authGuard] },
  // { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

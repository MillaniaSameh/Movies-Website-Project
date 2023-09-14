import { Component, Input } from '@angular/core';
import { IMovie } from 'src/app/Interfaces/imovie';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
})

export class MovieCardComponent {
  @Input() movie!: IMovie;
}
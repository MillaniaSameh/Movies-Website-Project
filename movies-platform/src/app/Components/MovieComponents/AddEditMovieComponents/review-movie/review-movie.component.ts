import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-review-movie',
  templateUrl: './review-movie.component.html',
  styleUrls: ['./review-movie.component.css']
})

export class ReviewMovieComponent {
  @Input() reviewsForm!: FormGroup;

  constructor() {
  }

  get review() {
    return this.reviewsForm.controls['reviews'] as FormGroup;
  }
}

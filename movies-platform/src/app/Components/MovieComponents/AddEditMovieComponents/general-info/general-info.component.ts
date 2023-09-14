import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MovieService } from 'src/app/Services/movie.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})

export class GeneralInfoComponent {
  @Input() generalInfoForm!: FormGroup;
  @Output() imagePath = new EventEmitter<string>();

  constructor(private movieService: MovieService) {
  }

  get title () {
    return this.generalInfoForm.get('title');
  }

  get description () {
    return this.generalInfoForm.get('description');
  }

  get releaseYear () {
    return this.generalInfoForm.get('releaseYear');
  }
  
  get poster () {
    return this.generalInfoForm.get('poster');
  }

  onFileChange(event: any) {
    if(event.target.files[0] == null)
      return;

    this.movieService.uploadImage(<File>event.target.files[0]).subscribe({
      next: (response) => {
        this.imagePath.emit(response);
      }
    })
  }
}

import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MovieService } from 'src/app/Services/movie.service';

@Component({
  selector: 'app-actors-list',
  templateUrl: './actors-list.component.html',
  styleUrls: ['./actors-list.component.css']
})

export class ActorsListComponent {
  @Input() actorsForm!: FormGroup;
  originalActorsList!: String[];
  filteredActorsList!: String[];
  duplicateActor: boolean = false;

  constructor(private movieService: MovieService, private fb: FormBuilder) {
    this.getAllActors()
  }

  get actors() {
    return this.actorsForm.controls['actors'] as FormArray;
  }

  addActor() {
    this.actors.push(this.fb.control('', Validators.required));
  }

  removeActor(index: number) {
    this.actors.removeAt(index);
  }

  addActorFromList(actor: String) {

    if(this.actors.length == 1 && this.actors.at(0).value == "")
      this.actors.removeAt(0);

    if(this.actors.value.includes(actor))
    {
      this.duplicateActor = true;
      setTimeout(() => {
        this.duplicateActor = false;
      }, 2000)
      return;
    }

    this.actors.push(this.fb.control(actor, Validators.required));
  }

  closeAlert() {
    this.duplicateActor = false;
  }

  getAllActors() {
    this.movieService.getAllActors().subscribe({
      next: (response) => {
        this.originalActorsList = response.sort();
        this.filteredActorsList = this.originalActorsList;
        // this.actorsList.sort();
      }
    })
  }

  filterActors(event: any) {
    let searchTerm: string = event.target.value;
    
    this.filteredActorsList = this.originalActorsList.filter(
      actor => actor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
}

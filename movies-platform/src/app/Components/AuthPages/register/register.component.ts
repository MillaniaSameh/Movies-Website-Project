import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from 'src/app/Services/auth.service';
import { IRegister } from 'src/app/Interfaces/iregister';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  registerRequestSent: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,4}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z]).{8,32}$")]]
    });
  }

  get username() {
    return this.registerForm.get('username')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get password() {
    return this.registerForm.get('password')
  }
  
  handleRegister() {
    let userInput: IRegister = <IRegister>this.registerForm.value;

    this.registerRequestSent = true;

    setTimeout(() => {
      this.authService.register(userInput).subscribe({
        next: () => {
          localStorage.setItem("username", userInput.username);
          this.authService.isLoggedSubject.next(true);
          this.router.navigate(["/Home"]);
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }, 1000)
  }
}

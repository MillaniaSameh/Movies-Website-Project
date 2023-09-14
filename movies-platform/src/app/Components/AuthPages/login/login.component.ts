import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from 'src/app/Services/auth.service';
import { ILogin } from 'src/app/Interfaces/ilogin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loginRequestSent: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  
  handleLogin() {
    let userInput: ILogin = <ILogin>this.loginForm.value;

    this.loginRequestSent = true;

    setTimeout(() => {
      this.authService.login(userInput).subscribe({
        next: (response) => {
          localStorage.setItem("username", response);
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

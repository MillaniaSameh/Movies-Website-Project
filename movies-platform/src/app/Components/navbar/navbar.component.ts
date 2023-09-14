import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  isUserLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getLoggedStatus().subscribe(status => {
      this.isUserLogged = status;
    })
  }

  ngOnInit() {
    this.authService.getLoggedStatus().subscribe(status => {
      this.isUserLogged = status;
    })
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem("username");
        this.authService.isLoggedSubject.next(false);
        this.router.navigate(["/Login"]);
      }
    });
  }
}

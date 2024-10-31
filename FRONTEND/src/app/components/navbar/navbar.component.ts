import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from 'src/app/interface/auth-data.interface';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  user!: AuthData | null;
  isAdmin: boolean = false;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((data) => {
      this.user = data;
      this.isAdmin = this.user?.user.tipoUtente === 'ADMIN';
    });
  }

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/auth']); // Redirect to login after logout
  }

  handleSceltaPianetaClick() {
    if (this.user) {
      this.router.navigate(['/sceltaPianeta']);
    } else {
      this.authSrv.redirectUrl = '/sceltaPianeta';  // Save the redirect URL
      this.router.navigate(['/auth']);
    }
  }

  handleAdminClick() {
    if (this.user) {
      this.router.navigate(['/admin']);
    } else {
      this.authSrv.redirectUrl = '/admin';
      this.router.navigate(['/auth']);
    }
  }

  redirectToAuth() {
    this.router.navigate(['/auth']);
  }
}

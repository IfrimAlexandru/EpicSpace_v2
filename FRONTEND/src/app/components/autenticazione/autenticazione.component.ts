import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-autenticazione',
  templateUrl: './autenticazione.component.html',
  styleUrls: ['./autenticazione.component.scss']
})
export class AutenticazioneComponent {
  isLoginActive: boolean = true;
  email: string = '';
  password: string = '';
  username: string = ''; // Per registrazione
  nome: string = ''; // Per registrazione
  cognome: string = ''; // Per registrazione

  constructor(private authService: AuthService, private router: Router) {}

  toggleSlide(isLogin: boolean): void {
    this.isLoginActive = !isLogin;
  }

  onLogin() {
    const loginData = { email: this.email, password: this.password };
    this.authService.login(loginData).subscribe(
      response => {
        console.log('Login successful', response);
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage after login:', token);
        this.router.navigate(['/']); // Navigate to homepage after successful login
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  onRegister() {
    const registerData = { username: this.username, password: this.password, email: this.email, nome: this.nome, cognome: this.cognome };
    this.authService.register(registerData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.toggleSlide(true); // Switch to login form after successful registration
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }
}


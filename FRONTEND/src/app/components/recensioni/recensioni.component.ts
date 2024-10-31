import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-recensioni',
  templateUrl: './recensioni.component.html',
  styleUrls: ['./recensioni.component.scss']
})
export class RecensioniComponent implements OnInit {

  reviewText: string = '';
  recensioni: any[] = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadRecensioni();
  }

  loadRecensioni(): void {
    // const token = this.authService.getToken();
    // if (token) {
      // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any[]>(`${environment.apiUrl}recensioni`).subscribe(data => {
        this.recensioni = data;
      }, error => {
        console.error('Error loading recensioni', error);
      });
    // } else {
    //   this.router.navigate(['/auth']);
    // }
  }

  submitReview(): void {
    const text = this.reviewText;
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${environment.apiUrl}recensioni`, { text }, { headers }).subscribe(response => {
        console.log('Review submitted', response);
        this.reviewText = ''; // Clear the form after submission
        this.loadRecensioni(); // Reload recensioni
      }, error => {
        console.error('Error submitting review', error);
      });
    } else {
      console.error('No token found, user might not be authenticated');
      this.router.navigate(['/auth']);
    }
  }

  deleteRecensione(id: number): void {
    if (confirm('Sei sicuro di voler cancellare questa recensione?')) {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.delete(`${environment.apiUrl}recensioni/${id}`, { headers }).subscribe(() => {
          console.log('Review deleted');
          this.loadRecensioni(); // Reload recensioni after deletion
        }, error => {
          console.error('Error deleting review', error);
        });
      } else {
        console.error('No token found, user might not be authenticated');
        this.router.navigate(['/auth']);
      }
    }
  }

  formatAuthorName(nome: string, cognome: string): string {
    return `${nome} ${cognome.charAt(0)}.`;
  }
}

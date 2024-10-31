import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Recensione } from 'src/app/interface/recensione.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navicelle: any[] = [];
  pianeti: any[] = [];
  navicellePairs: any[][] = [];
  pianetiGroups: any[][] = [];
  recensioni: Recensione[] = [];
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    this.loadNavicelle();
    this.loadPianeti();
    this.loadRecensioni();
  }

  loadNavicelle(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}navi_spaziali`, { headers }).subscribe(data => {
      this.navicelle = data;
      this.groupNavicelleInPairs();
    });
  }

  loadPianeti(): void {
    this.http.get<any[]>(`${environment.apiUrl}pianeti`).subscribe(data => {
      this.pianeti = data;
      this.groupPianeti();
    });
  }

  loadRecensioni(): void {
    const token = this.authService.getToken();
    // if (token) {
      // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<Recensione[]>(`${environment.apiUrl}recensioni`).subscribe(data => {
        console.log('Received recensioni data in home:', data); // Log data for debugging
        this.recensioni = data.slice(0, 2); // Prendi solo le prime due recensioni
      }, error => {
        console.error('Error loading recensioni', error);
      });
    // } else {
      // this.router.navigate(['/auth']);
    // }
  }

  groupPianeti(): void {
    this.pianetiGroups = [];
    let group: any[] = [];
    for (let i = 0; i < this.pianeti.length; i++) {
      group.push(this.pianeti[i]);
      if (group.length === 3 || i === this.pianeti.length - 1) {
        this.pianetiGroups.push(group);
        group = [];
      }
    }
  }

  groupNavicelleInPairs(): void {
    for (let i = 0; i < this.navicelle.length; i += 2) {
      this.navicellePairs.push(this.navicelle.slice(i, i + 2));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  prenotaOra(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sceltaPianeta']);
    } else {
      this.authService.redirectUrl = '/sceltaPianeta';
      this.router.navigate(['/auth']);
    }
  }

  formatAuthorName(nome: string, cognome: string): string {
    return `${nome} ${cognome.charAt(0)}.`;
  }
}

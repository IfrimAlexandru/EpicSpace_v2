import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Recensione } from 'src/app/interface/recensione.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  navicelle: any[] = [];
  pianeti: any[] = [];
  recensioni: Recensione[] = [];
  isAdmin: boolean = false;

  // Indice per il carousel dei pianeti
  currentIndex = 0;

  // Indice per il carousel delle navicelle
  currentNavicellaIndex = 0;

  // Getter per calcolare indice precedente e successivo nel carousel dei pianeti
  get prevIndex(): number {
    return (this.currentIndex - 1 + this.pianeti.length) % this.pianeti.length;
  }

  get nextIndex(): number {
    return (this.currentIndex + 1) % this.pianeti.length;
  }

  // Getter per calcolare indice precedente e successivo nel carousel delle navicelle
  get prevNavicellaIndex(): number {
    return (this.currentNavicellaIndex - 1 + this.navicelle.length) % this.navicelle.length;
  }

  get nextNavicellaIndex(): number {
    return (this.currentNavicellaIndex + 1) % this.navicelle.length;
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica se l'utente è admin
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';

    // Carica i dati
    this.loadNavicelle();
    this.loadPianeti();
    this.loadRecensioni();
  }

  ngAfterViewInit(): void {
    // Forza l'audio in muto per l'autoplay del video
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.load();
      videoElement.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    }
  }

  // ==============================
  // CARICAMENTO DATI
  // ==============================

  loadNavicelle(): void {
    this.http.get<any[]>(`${environment.apiUrl}navi_spaziali`).subscribe(
      data => {
        this.navicelle = data;
        console.log('Navicelle ricevute:', this.navicelle);
      },
      error => {
        console.error('Errore nel caricamento delle navicelle', error);
      }
    );
  }

  loadPianeti(): void {
    this.http.get<any[]>(`${environment.apiUrl}pianeti`).subscribe(
      data => {
        this.pianeti = data;
      },
      error => {
        console.error('Error loading pianeti', error);
      }
    );
  }

  loadRecensioni(): void {
    this.http.get<Recensione[]>(`${environment.apiUrl}recensioni`).subscribe(
      data => {
        console.log('Received recensioni data in home:', data);
        this.recensioni = data.slice(0, 2); // Mostra solo le prime due recensioni
      },
      error => {
        console.error('Error loading recensioni', error);
      }
    );
  }

  // ==============================
  // ALTRE FUNZIONI
  // ==============================

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

  // Eventi per la navigazione del carousel dei pianeti
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.pianeti.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.pianeti.length) % this.pianeti.length;
  }

  // Eventi per la navigazione del carousel delle navicelle
  nextNavicella(): void {
    this.currentNavicellaIndex = (this.currentNavicellaIndex + 1) % this.navicelle.length;
  }

  prevNavicella(): void {
    this.currentNavicellaIndex = (this.currentNavicellaIndex - 1 + this.navicelle.length) % this.navicelle.length;
  }
}

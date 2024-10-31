import { Component, OnInit } from '@angular/core';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scelta-tuta',
  templateUrl: './scelta-tuta.component.html',
  styleUrls: ['./scelta-tuta.component.scss']
})
export class SceltaTutaComponent implements OnInit {
  tute: any[] = [];
  tutePairs: any[][] = [];
  selectedSuit: any = null;
  isFront: { [key: string]: boolean } = {};

  constructor(
    private scelteUtenteService: ScelteUtenteService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTute();
  }

  loadTute(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}tute_spaziali`, { headers }).subscribe(data => {
      this.tute = data;
      this.groupTuteInPairs();
      this.tute.forEach(tuta => {
        this.isFront[tuta.id] = true; // Initialize all suits to show the front image
      });
    });
  }

  groupTuteInPairs(): void {
    for (let i = 0; i < this.tute.length; i += 2) {
      this.tutePairs.push(this.tute.slice(i, i + 2));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  selectSuit(suit: any) {
    this.selectedSuit = suit;
    this.scelteUtenteService.setSuit(suit); // Set suit and suitImg in the service
    this.updateSelectedSuitUI();
  }

  toggleImage(tutaId: string) {
    this.isFront[tutaId] = !this.isFront[tutaId];
  }

  private updateSelectedSuitUI() {
    const suits = document.querySelectorAll('.suit img');
    suits.forEach((img) => {
      img.classList.remove('selected');
    });
    const selectedImg = document.querySelector(`.suit img[alt="${this.selectedSuit.nome}"]`);
    if (selectedImg) {
      selectedImg.classList.add('selected');
    }
  }

  goToSummary() {
    if (!this.selectedSuit) {
      alert('Per favore, seleziona una tuta prima di procedere.');
      return;
    }
    this.router.navigate(['/riepilogo']); // Navigate to the summary (riepilogo)
  }
}

import { Component, OnInit } from '@angular/core';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scelta-nave',
  templateUrl: './scelta-nave.component.html',
  styleUrls: ['./scelta-nave.component.scss']
})
export class SceltaNaveComponent implements OnInit {
  navicelle: any[] = [];
  navicellePairs: any[][] = [];  // Array to hold pairs of navicelle
  selectedShip: any = null;

  constructor(
    private scelteUtenteService: ScelteUtenteService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNavicelle();
  }

  loadNavicelle(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}navi_spaziali`, { headers }).subscribe(data => {
      this.navicelle = data;
      this.groupNavicelleInPairs();  // Group navicelle in pairs
    });
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

  selectShip(ship: any) {
    this.selectedShip = ship;
    this.scelteUtenteService.setChoice('ship', ship.nome);
    this.scelteUtenteService.setShipImg(ship.immagine);  // Set ship image in service
    this.updateSelectedShipUI();
  }

  private updateSelectedShipUI() {
    const ships = document.querySelectorAll('.ship img');
    ships.forEach((img) => {
      img.classList.remove('selected');
    });
    const selectedImg = document.querySelector(`.ship img[alt="${this.selectedShip.nome}"]`);
    if (selectedImg) {
      selectedImg.classList.add('selected');
    }
  }

  goToNextStep() {
    if (!this.selectedShip) {
      alert('Per favore, seleziona una navicella prima di procedere.');
      return;
    }
    this.router.navigate(['/sceltaTuta']);  // Navigate to the next step (scelta tuta)
  }
}

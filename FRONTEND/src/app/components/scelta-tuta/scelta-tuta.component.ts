import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  @ViewChild('suitCarousel', { static: true }) suitCarousel!: ElementRef;

  tute: any[] = [];
  tuteGroups: any[][] = []; // Array per contenere i gruppi di tute
  selectedSuit: any = null;
  isFront: { [key: string]: boolean } = {};

  constructor(
    private scelteUtenteService: ScelteUtenteService,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadTute();
    this.groupTute(); // Raggruppamento iniziale in base alla dimensione dello schermo
    this.initCarouselEvents(); // Inizializza gli eventi del carosello
  }

  ngOnDestroy(): void {
    this.removeCarouselEvents(); // Pulisce gli eventi quando il componente viene distrutto
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.groupTute(); // Raggruppa nuovamente le tute al cambio di dimensione dello schermo
  }

  loadTute(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}tute_spaziali`, { headers }).subscribe(data => {
      this.tute = data;
      this.groupTute();
      this.tute.forEach(tuta => {
        this.isFront[tuta.id] = true; // Inizializza tutte le tute per mostrare l'immagine frontale
      });
    });
  }

  groupTute(): void {
    this.tuteGroups = [];
    const groupSize = window.innerWidth < 768 ? 1 : 2; // 1 tuta sotto 768px, 2 tute sopra

    let group: any[] = [];
    for (let i = 0; i < this.tute.length; i++) {
      group.push(this.tute[i]);
      if (group.length === groupSize || i === this.tute.length - 1) {
        this.tuteGroups.push(group);
        group = [];
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  selectSuit(suit: any): void {
    this.selectedSuit = suit;
    this.scelteUtenteService.setSuit(suit); // Imposta la tuta nel servizio
    this.updateSelectedSuitUI();
  }

  toggleImage(tutaId: string): void {
    this.isFront[tutaId] = !this.isFront[tutaId];
  }

  private updateSelectedSuitUI(): void {
    const suits = document.querySelectorAll('.suit img');
    suits.forEach((img) => {
      img.classList.remove('selected');
    });
    if (this.selectedSuit) {
      const selectedImg = document.querySelector(`.suit img[alt="${this.selectedSuit.nome}"]`);
      if (selectedImg) {
        selectedImg.classList.add('selected');
      }
    }
  }

  goToSummary(): void {
    if (!this.selectedSuit) {
      alert('Per favore, seleziona una tuta prima di procedere.');
      return;
    }
    this.router.navigate(['/riepilogo']); // Naviga alla pagina di riepilogo
  }

  private initCarouselEvents(): void {
    this.renderer.listen(this.suitCarousel.nativeElement, 'slide.bs.carousel', () => {
      this.resetDetails();
    });
  }

  private removeCarouselEvents(): void {
    // Il Renderer2 si occupa automaticamente della pulizia
  }

  private resetDetails(): void {
    // Resetta la tuta selezionata
    this.selectedSuit = null;

    // Rimuove la classe "selected" da tutte le immagini
    const suits = document.querySelectorAll('.suit img');
    suits.forEach((img) => {
      img.classList.remove('selected');
    });
  }
}

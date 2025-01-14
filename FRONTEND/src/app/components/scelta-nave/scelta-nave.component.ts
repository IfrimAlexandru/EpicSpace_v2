import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scelta-nave',
  templateUrl: './scelta-nave.component.html',
  styleUrls: ['./scelta-nave.component.scss']
})
export class SceltaNaveComponent implements OnInit, OnDestroy {
  @ViewChild('shipCarousel', { static: true }) shipCarousel!: ElementRef;

  navicelle: any[] = [];
  navicelleGroups: any[][] = [];
  selectedShip: any = null;

  constructor(
    private scelteUtenteService: ScelteUtenteService,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadNavicelle();
    this.groupNavicelle();       // Raggruppa navi inizialmente
    this.initCarouselEvents();   // Inizializza gli eventi del carosello
  }

  ngOnDestroy(): void {
    this.removeCarouselEvents(); // Cleanup degli eventi
  }

  /**
   * Cattura il resize della finestra per ricalcolare i gruppi di navicelle
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.groupNavicelle();
  }

  /**
   * Carica le navicelle dal backend
   */
  loadNavicelle(): void {
    const headers = this.getAuthHeaders();
    this.http
      .get<any[]>(`${environment.apiUrl}navi_spaziali`, { headers })
      .subscribe((data: any[]) => {
        this.navicelle = data;
        this.groupNavicelle();
      });
  }

  /**
   * Raggruppa le navicelle in base alle dimensioni dello schermo
   */
  groupNavicelle(): void {
    this.navicelleGroups = [];
    const groupSize = window.innerWidth < 768 ? 1 : 2; // Esempio di logica di grouping

    let group: any[] = [];
    for (let i = 0; i < this.navicelle.length; i++) {
      group.push(this.navicelle[i]);
      if (group.length === groupSize || i === this.navicelle.length - 1) {
        this.navicelleGroups.push(group);
        group = [];
      }
    }
  }

  /**
   * Recupera l'header di autenticazione
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Gestisce la selezione di una nave
   */
  selectShip(ship: any): void {
    this.selectedShip = ship;
    this.scelteUtenteService.setChoice('ship', ship.nome);
    this.scelteUtenteService.setShipImg(ship.immagine); // Imposta l'immagine della nave nel service
    this.updateSelectedShipUI();
  }

  /**
   * Aggiorna la classe 'selected' per evidenziare la nave selezionata
   */
  private updateSelectedShipUI(): void {
    const ships = document.querySelectorAll('.ship img');
    ships.forEach((img) => {
      img.classList.remove('selected');
    });

    if (this.selectedShip) {
      const selectedImg = document.querySelector(`.ship img[alt="${this.selectedShip.nome}"]`);
      if (selectedImg) {
        selectedImg.classList.add('selected');
      }
    }
  }

  /**
   * Naviga alla schermata successiva
   */
  goToNextStep(): void {
    if (!this.selectedShip) {
      alert('Per favore, seleziona una navicella prima di procedere.');
      return;
    }
    this.router.navigate(['/sceltaTuta']);
  }

  /**
   * Inizializza l'ascolto dell'evento "slide.bs.carousel" per azzerare i dettagli nave
   */
  private initCarouselEvents(): void {
    this.renderer.listen(this.shipCarousel.nativeElement, 'slide.bs.carousel', () => {
      this.resetSelectedShip();
    });
  }

  /**
   * Funzione di cleanup: il Renderer2 gestisce gli eventi, 
   * qui si può aggiungere altro se necessario
   */
  private removeCarouselEvents(): void {
    // Il Renderer2 pulisce automaticamente gli eventi creati tramite .listen()
    // Puoi aggiungere qui eventuali altre operazioni di cleanup se servono
  }

  /**
   * Azzera la nave selezionata quando cambia slide
   */
  private resetSelectedShip(): void {
    // Resetta la nave selezionata
    this.selectedShip = null;

    // Rimuove la classe 'selected' da tutte le immagini
    const ships = document.querySelectorAll('.ship img');
    ships.forEach((img) => {
      img.classList.remove('selected');
    });
  }
}

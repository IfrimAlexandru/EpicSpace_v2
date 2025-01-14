import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { PlanetService } from 'src/app/service/planet.service';
import { Pianeta } from 'src/app/interface/pianeta.interface';

type PlanetName = "luna" | "marte" | "venere" | "nettuno" | "mercurio" | "giove" | "saturno" | "urano" | "plutone";

@Component({
  selector: 'app-scelta-pianeta',
  templateUrl: './scelta-pianeta.component.html',
  styleUrls: ['./scelta-pianeta.component.scss']
})
export class SceltaPianetaComponent implements OnInit, OnDestroy {
  @ViewChild('planetCarousel', { static: true }) planetCarousel!: ElementRef;

  selectedPlanet: PlanetName | null = null;

  planetDetails = {
    luna: { flightTime: '3 ore', distance: '384,400 km', price: '2000€' },
    marte: { flightTime: '2 ore con warp', distance: '78 milioni di km', price: '10000€' },
    venere: { flightTime: '1 ora con warp', distance: '41 milioni di km', price: '15000€' },
    nettuno: { flightTime: '5 giorni con warp', distance: '4351 milioni di km', price: '20000€' },
    mercurio: { flightTime: '2 ore con warp', distance: '77 milioni di km', price: '23000€' },
    giove: { flightTime: '16 ore con warp', distance: '628 milioni di km', price: '28000€' },
    saturno: { flightTime: '33 ore con warp', distance: '1275 miliardi di km', price: '33000€' },
    urano: { flightTime: '3 giorni con warp', distance: '2723 miliardi di km', price: '37000€' },
    plutone: { flightTime: '6 giorni con warp', distance: '5913 miliardi di km', price: '41000€' }
  };

  pianeti: Pianeta[] = [];
  pianetiGroups: Pianeta[][] = [];

  constructor(private planetService: PlanetService, private scelteUtenteService: ScelteUtenteService, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadPianeti();
    window.addEventListener('resize', this.onResize.bind(this));
    this.initCarouselEvents();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
    this.removeCarouselEvents();
  }

  loadPianeti(): void {
    this.planetService.getPlanets().subscribe(
      (data: Pianeta[]) => {
        console.log('Received pianeti data:', data);
        this.pianeti = data;
        this.groupPianeti();
      },
      error => {
        console.error('Error loading pianeti:', error);
      }
    );
  }

  onResize(): void {
    this.groupPianeti();
  }

  groupPianeti(): void {
    this.pianetiGroups = [];
    let group: Pianeta[] = [];
    let groupSize = 3; // Default group size for larger screens

    if (window.innerWidth < 576) {
      groupSize = 1; // 1 pianeta/navicella/tuta sotto 576px
    } else if (window.innerWidth < 992) {
      groupSize = 2; // 2 pianeti sotto 768px
    }

    for (let i = 0; i < this.pianeti.length; i++) {
      group.push(this.pianeti[i]);
      if (group.length === groupSize || i === this.pianeti.length - 1) {
        this.pianetiGroups.push(group);
        group = [];
      }
    }
  }

  get details() {
    return this.selectedPlanet ? this.planetDetails[this.selectedPlanet] : { flightTime: '', distance: '', price: '' };
  }

  selectPlanet(pianeta: Pianeta): void {
    this.selectedPlanet = pianeta.nome as keyof typeof this.planetDetails;
    this.scelteUtenteService.setChoice('planet', pianeta.nome);
    this.scelteUtenteService.setChoice('planetImg', pianeta.immagine);
    console.log('Selected planet image:', pianeta.immagine);
    this.updateSelectedPlanetUI();
  }

  proceedToNextStep(): void {
    if (!this.selectedPlanet) {
      alert('Per favore, seleziona un pianeta prima di procedere.');
      return;
    }
    this.router.navigate(['/sceltaNave']);
  }

  private updateSelectedPlanetUI() {
    const planets = document.querySelectorAll('.planet img, .saturno img');
    planets.forEach((img) => {
      img.classList.remove('selected');
    });
    const selectedImg = document.querySelector(`.planet img[alt="${this.selectedPlanet}"], .saturno img[alt="${this.selectedPlanet}"]`);
    if (selectedImg) {
      selectedImg.classList.add('selected');
    }
  }

    // Inizializzazione degli eventi del carosello
    private initCarouselEvents(): void {
      this.renderer.listen(this.planetCarousel.nativeElement, 'slide.bs.carousel', () => {
        this.resetDetails();
      });
    }
  
    // Rimuovere eventi del carosello
    private removeCarouselEvents(): void {
      // Esegui pulizia automatica grazie a Renderer2
    }
  
    private resetDetails(): void {
      // Resetta il pianeta selezionato
      this.selectedPlanet = null;
  
      // Rimuove la classe "selected" da tutte le immagini
      const planets = document.querySelectorAll('.planet img, .saturno img');
      planets.forEach((img) => {
        img.classList.remove('selected');
      });
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.scss']
})
export class RiepilogoComponent implements OnInit {

  @ViewChild(CheckoutComponent) checkoutComponent!: CheckoutComponent;

  choices: any;
  buyerName: string = '';
  email: string = '';
  selectedDate: string = '';
  availableDates: string[] = [];
  isSubmitting: boolean = false;

  private apiUrl = `${environment.apiUrl}api/biglietti/submit-order`;
  private datesUrl = `${environment.apiUrl}api/dates`;

  constructor(
    private scelteUtenteService: ScelteUtenteService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserChoices();
    this.loadAvailableDates();
  }

  loadUserChoices(): void {
    this.choices = this.scelteUtenteService.getChoices();
    console.log('User choices:', this.choices);
    this.authService.user$.subscribe(user => {
      if (user) {
        this.buyerName = user.user.nome;
        this.email = user.user.email;
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  loadAvailableDates(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found, redirecting to login.');
      this.router.navigate(['/auth']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<{ id: number, data: string }[]>(this.datesUrl, { headers }).subscribe(
      data => {
        this.availableDates = data.map(dateObj => dateObj.data);
      },
      error => {
        console.error('Errore nel caricamento delle date disponibili:', error);
      }
    );
  }

  async unisciFunzionalita(): Promise<void> {
    if (confirm('Vuoi procedere con l\'acquisto?')) {
      const planet = this.choices.planet;
      const price = this.getPlanetPrice(planet);

      try {
        console.log('Inizio processo di acquisto');
        await this.onSubmit();
        console.log('Ordine sottomesso con successo, procedo al pagamento');
        await this.checkoutComponent.pay(price, planet);
        console.log('Pagamento completato');
      } catch (error) {
        console.error('Errore durante il processo di acquisto:', error);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) {
      console.log('Sottomissione già in corso, attendo...');
      return;
    }
    
    this.isSubmitting = true;
    console.log('Inizio sottomissione ordine');
  
    const data = {
      buyerName: this.buyerName,
      email: this.email,
      planet: this.choices.planet,
      ship: this.choices.ship,
      suit: this.choices.suit,
      planetImg: this.choices.planetImg,
      shipImg: this.choices.shipImg,
      suitImg: this.choices.suitImg,
      dataPrenotazione: this.selectedDate 
    };
  
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('Nessun token trovato, reindirizzando al login.');
      this.router.navigate(['/auth']);
      this.isSubmitting = false;
      return;
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    try {
      console.log('Invio della richiesta POST per l\'ordine');
      await this.http.post(this.apiUrl, data, { headers }).toPromise();
      this.scelteUtenteService.addBookedTrip(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ((error as any).status === 401) {
          console.error('Errore di autorizzazione, reindirizzando al login.');
          this.router.navigate(['/login']);
        } else {
          console.error('Errore:', error.message);
        }
      } else {
        console.error('Errore sconosciuto:', error);
      }
    } finally {
      this.isSubmitting = false;
      console.log('Fine sottomissione ordine');
    }
  }

  getPlanetPrice(planet: string): number {
    const planetDetails: Record<string, number> = {
      luna: 10000,
      marte: 20000,
      venere: 30000,
      nettuno: 40000,
      mercurio: 50000,
      giove: 60000,
      saturno: 70000,
      urano: 80000,
      plutone: 90000
    };
    return planetDetails[planet];
  }
}

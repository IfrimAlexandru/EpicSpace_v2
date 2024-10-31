import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment.development';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service'; // Importa il servizio

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  stripePromise = loadStripe(environment.stripe);

  constructor(private http: HttpClient, private scelteUtenteService: ScelteUtenteService) {} // Inietta il servizio

  async pay(price: number, planetName: string): Promise<void> { 
    const choices = this.scelteUtenteService.getChoices(); // Usa il servizio per ottenere le scelte

    const payment = {
      name: `Viaggio spaziale per ${planetName}`,
      currency: 'eur', 
      amount: price * 100, 
      quantity: 1,
      cancelUrl: `${window.location.origin}/cancel`,  // URL di cancellazione
      successUrl: `${window.location.origin}/success`, // URL di successo
      metadata: {
        buyerName: choices.buyerName,
        email: choices.email,
        planet: choices.planet,
        ship: choices.ship,
        suit: choices.suit,
        selectedDate: choices.selectedDate
      }
    };

    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe non è stato caricato correttamente.');
      return;
    }

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${environment.serverUrl}/payment`, payment, { headers }).subscribe((data: any) => {
      console.log('Ricevuto sessionId:', data.id); // Log del sessionId ricevuto
      stripe.redirectToCheckout({
        sessionId: data.id,
      }).then((result) => {
        if (result.error) {
          console.error('Errore durante il redirect a Stripe:', result.error.message);
        }
      });
    }, (error) => {
      console.error('Errore durante la chiamata al server:', error);
    });
  }
}

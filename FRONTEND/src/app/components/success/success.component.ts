import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private scelteUtenteService: ScelteUtenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sendConfirmationEmail();
    setTimeout(() => {
      this.router.navigate(['/']); 
    }, 4000);
  }

  sendConfirmationEmail(): void {
    const choices = this.scelteUtenteService.getChoices();
    const data = {
      buyerName: choices.buyerName,
      email: choices.email,
      planet: choices.planet,
      ship: choices.ship,
      suit: choices.suit,
      selectedDate: choices.selectedDate
    };

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${environment.apiUrl}confirm-order`, data, { headers }).subscribe(
      response => {
        console.log('Email di conferma inviata con successo:', response);
      },
      error => {
        console.error('Errore durante l\'invio dell\'email di conferma:', error);
      }
    );
  }
}

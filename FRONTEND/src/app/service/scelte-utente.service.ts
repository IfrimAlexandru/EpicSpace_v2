import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScelteUtenteService {
  private choices: any = {
    planet: '',
    ship: '',
    suit: '',
    planetImg: '',
    shipImg: '',
    suitImg: ''
  };

  private bookedTrips: any[] = [];

  private apiUrl = `${environment.apiUrl}api/biglietti`;

  constructor(private http: HttpClient) {}

  setChoice(key: string, value: any) {
    this.choices[key] = value;
  }

  getChoices() {
    return this.choices;
  }

  setPlanetImg(img: string) {
    this.choices.planetImg = img;
  }

  setShipImg(img: string) {
    this.choices.shipImg = img;
  }

  setSuit(suit: any) {
    this.choices.suit = suit.nome;
    this.choices.suitImg = suit.immagineFronte;
  }

  addBookedTrip(tripData: any) {
    this.bookedTrips.push(tripData);
    this.updateLocalStorage();
  }

  getBookedTrips(email: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/booked-trips-by-email/${email}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  clearBookedTrips() {
    this.bookedTrips = [];
    localStorage.removeItem('bookedTrips');
  }

  private updateLocalStorage() {
    localStorage.setItem('bookedTrips', JSON.stringify(this.bookedTrips));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

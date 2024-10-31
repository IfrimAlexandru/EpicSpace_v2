import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pianeta } from '../interface/pianeta.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  private apiUrl = `${environment.apiUrl}pianeti`; 

  constructor(private http: HttpClient) {}

  getPlanets(): Observable<Pianeta[]> {
    return this.http.get<Pianeta[]>(`${this.apiUrl}`);
  }
}

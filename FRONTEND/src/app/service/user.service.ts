import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from '../interface/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  
updateUser(id: number, user: User): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.put<User>(url, user);
  }

}

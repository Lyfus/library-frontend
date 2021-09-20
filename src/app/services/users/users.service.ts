import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    return this.http.post<any>("http://127.0.0.1:3000/users/login", credentials);
  }
}

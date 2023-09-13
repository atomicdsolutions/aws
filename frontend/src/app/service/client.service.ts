import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients`);
  }

  addClient(client: any): Observable<any> {
    // console.log(client);
    return this.http.post<Client>(`${this.baseUrl}/clients`, client);
  }

  updateClient(id: number, client: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/clients/${id}`, client);
  }
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clients/${id}`);
  }
}

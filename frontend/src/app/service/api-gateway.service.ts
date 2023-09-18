import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }


  getUsagePlan(client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-usage-plan`, client);
  }

  getUsage(client: Client): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-usage`, client );
  }
  getPreviousMonthUsage(client: Client): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-previous-month-usage`, client );
  }
  getApiKeys(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-api-keys`);
  }
}

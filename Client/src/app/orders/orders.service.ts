import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IOrder } from '../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getOrdersForUser() {
    return this.http.get<IOrder[]>(this.baseUrl + '/orders');
  }
  getOrderDetailed(id: number) {
    return this.http.get<IOrder>(this.baseUrl + '/orders/' + id);
  }
}

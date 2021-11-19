import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAvailableDelivery() {
    return this.http
      .get<IDeliveryMethod[]>(this.baseUrl + '/orders/deliveryMethods')
      .pipe(map((dm) => dm.sort((a, b) => b.price - a.price)));
  }
}

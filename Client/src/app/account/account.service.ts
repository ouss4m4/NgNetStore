import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CartService } from '../cart/cart.service';
import { IAddress, IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private nullUser: IUser = {
    displayName: '',
    email: '',
    token: '',
  };

  baseUrl = environment.apiUrl;

  private _currentUser$ = new BehaviorSubject<IUser>(this.nullUser);
  public currentUser$ = this._currentUser$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  public getCurrentUserValue() {
    return this._currentUser$.value;
  }

  public loadCurrentUser(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IUser>(this.baseUrl + '/account', { headers }).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this._currentUser$.next(user);
        }
      })
    );
  }

  public login(values: any) {
    return this.http.post<IUser>(this.baseUrl + '/account/login', values).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this._currentUser$.next(user);
        }
        return user;
      })
    );
  }

  public register(values: any) {
    return this.http
      .post<IUser>(this.baseUrl + '/account/register', values)
      .pipe(
        map((user) => {
          localStorage.setItem('token', user.token);
          this._currentUser$.next(user);
        })
      );
  }

  public logout() {
    localStorage.removeItem('token');
    // localStorage.removeItem('cart_id');
    this._currentUser$.next(this.nullUser);
    // this.cartService.clearCart();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  public checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + '/account/emailexists?email=' + email);
  }

  public getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + '/account/address');
  }

  public updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + '/account/address', address);
  }
}

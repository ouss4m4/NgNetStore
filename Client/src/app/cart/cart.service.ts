import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cart, ICart, ICartItem, ICartTotals } from '../shared/models/cart';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public baseUrl = environment.apiUrl;
  private _cart$ = new BehaviorSubject<ICart>(new Cart('initial'));
  public cart$ = this._cart$.asObservable();
  private _cartTotal$ = new BehaviorSubject<ICartTotals>({
    shipping: 0,
    subtotal: 0,
    total: 0,
  });
  public cartTotal$ = this._cartTotal$.asObservable();

  constructor(private http: HttpClient) {}

  fetchCart(id: string) {
    return this.http.get<ICart>(this.baseUrl + '/cart?id=' + id).pipe(
      tap((cart) => {
        this._cart$.next(cart);
        this.calculateTotals();
      })
    );
  }

  setCart(cart: ICart) {
    return this.http
      .post<ICart>(this.baseUrl + '/cart', cart)
      .subscribe((res) => {
        this._cart$.next(res);
        this.calculateTotals();
      }, console.log);
  }

  getCurrentCartValue() {
    return this._cart$.value;
  }

  addItemToCart(item: IProduct, quantity = 1) {
    const itemToAdd: ICartItem = this.mapProductToCartItem(item, quantity);
    const cart =
      this.getCurrentCartValue().id !== 'initial'
        ? this.getCurrentCartValue()
        : this.createCart();
    cart.items = this.handleAddItemToCart(cart.items, itemToAdd, quantity);
    this.setCart(cart);
  }

  private calculateTotals() {
    const cart = this.getCurrentCartValue();
    const shipping = 0;
    const subtotal = cart.items.reduce(
      (acc, val) => (acc += val.price * val.quantity),
      0
    );
    const total = shipping + subtotal;
    this._cartTotal$.next({
      shipping,
      subtotal,
      total,
    });
  }

  private handleAddItemToCart(
    items: ICartItem[],
    itemToAdd: ICartItem,
    quantity: number
  ): ICartItem[] {
    const index = items.findIndex((i) => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private mapProductToCartItem(item: IProduct, quantity: number): ICartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}

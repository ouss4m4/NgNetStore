import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cart, ICart, ICartItem, ICartTotals } from '../shared/models/cart';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private initialCart: ICart = {
    id: 'initial',
    items: [],
  };
  private initialTotal: ICartTotals = {
    shipping: 0,
    subtotal: 0,
    total: 0,
  };
  public baseUrl = environment.apiUrl;
  private _cart$ = new BehaviorSubject<ICart>(this.initialCart);
  public cart$ = this._cart$.asObservable();
  private _cartTotal$ = new BehaviorSubject<ICartTotals>(this.initialTotal);
  public cartTotal$ = this._cartTotal$.asObservable();
  public shipping = 0;

  constructor(private http: HttpClient) {}

  createPaymentIntent() {
    return this.http
      .post<Cart>(
        this.baseUrl + '/payments/' + this.getCurrentCartValue().id,
        {}
      )
      .pipe(
        tap((cart) => {
          this._cart$.next(cart);
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const cart = this.getCurrentCartValue();
    cart.deliveryMethodId = deliveryMethod.id;
    cart.shippingPrice = deliveryMethod.price;
    this.calculateTotals();
    this.setCart(cart);
  }

  fetchCart(id: string) {
    return this.http.get<ICart>(this.baseUrl + '/cart?id=' + id).pipe(
      tap((cart) => {
        this._cart$.next(cart);
        if (cart.shippingPrice) {
          this.shipping = cart.shippingPrice;
        }
        this.calculateTotals();
      })
    );
  }

  clearCart() {
    this._cart$.next(this.initialCart);
    this._cartTotal$.next(this.initialTotal);
    localStorage.removeItem('cart_id');
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

  incrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex((i) => i.id === item.id);
    if (itemIndex === -1) return;
    cart.items[itemIndex].quantity++;

    this.setCart(cart);
  }

  decrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex((i) => i.id === item.id);
    if (itemIndex === -1) return;
    const cartItem = cart.items[itemIndex];
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.setCart(cart);
    } else {
      this.removeItemFromCart(item);
    }
  }
  public removeItemFromCart(item: ICartItem) {
    const cart = this.getCurrentCartValue();

    if (cart.items.some((x) => x.id === item.id)) {
      cart.items = cart.items.filter((x) => x.id !== item.id);
      if (cart.items.length > 0) {
        this.setCart(cart);
      } else {
        this.abandonCart(cart);
      }
    }
  }
  abandonCart(cart: ICart) {
    return this.http
      .delete(this.baseUrl + '/cart?id=' + cart.id)
      .subscribe((res) => {
        this._cart$.next(this.initialCart);
        this._cartTotal$.next(this.initialTotal);
        localStorage.removeItem('cart_id');
      }, console.log);
  }

  private calculateTotals() {
    const cart = this.getCurrentCartValue();
    const shipping = this.shipping;
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

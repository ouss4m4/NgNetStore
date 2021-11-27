import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.getCart();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.accountService.loadCurrentUser(token).subscribe();
    }
  }
  getCart() {
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      this.cartService.fetchCart(cartId).subscribe();
    }
  }
}

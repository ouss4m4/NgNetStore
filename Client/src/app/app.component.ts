import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartService } from './cart/cart.service';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';
import { ShopService } from './shop/shop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private cartService: CartService) {}
  ngOnInit() {
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      this.cartService.fetchCart(cartId).subscribe(console.log, console.log);
    }
  }
}

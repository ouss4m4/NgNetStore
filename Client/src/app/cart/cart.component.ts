import { Component, OnInit } from '@angular/core';
import { ICart, ICartItem } from '../shared/models/cart';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  public cart$ = this.cartServ.cart$;
  constructor(private cartServ: CartService) {}

  onRemoveClicked(item: ICartItem) {
    this.cartServ.removeItemFromCart(item);
  }

  onItemIncrementClick(item: ICartItem) {
    this.cartServ.incrementItemQuantity(item);
  }

  onItemDecrementCLick(item: ICartItem) {
    this.cartServ.decrementItemQuantity(item);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from '../../../cart/cart.service';
import { ICartItem } from '../../models/cart';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  @Output() decrement = new EventEmitter<ICartItem>();
  @Output() increment = new EventEmitter<ICartItem>();
  @Output() remove = new EventEmitter<ICartItem>();
  @Input() allowEdits: boolean = false;
  public cart$ = this.cartService.cart$;

  constructor(private cartService: CartService) {}

  decrementItemQuantity(item: ICartItem) {
    this.decrement.emit(item);
  }
  incrementItemQuantity(item: ICartItem) {
    this.increment.emit(item);
  }
  removeItem(item: ICartItem) {
    this.remove.emit(item);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { IProduct } from '../../shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  @Input() product?: IProduct;
  constructor(private cartServ: CartService) {}

  addItemToCart() {
    if (this.product) {
      this.cartServ.addItemToCart(this.product);
    }
  }
}

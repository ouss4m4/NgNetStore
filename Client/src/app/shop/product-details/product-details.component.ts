import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CartService } from '../../cart/cart.service';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product?: IProduct;
  quantity = 1;

  constructor(
    private shopService: ShopService,
    private activeRoute: ActivatedRoute,
    private breadCrumb: BreadcrumbService,
    private cartService: CartService
  ) {
    this.breadCrumb.set('@productDetails', ' ');
  }
  addItemToCart() {
    if (this.product) {
      this.cartService.addItemToCart(this.product, this.quantity);
    }
  }

  ngOnInit(): void {
    this.loadProduct();
  }
  increment() {
    this.quantity++;
  }
  decrement() {
    if (this.quantity <= 1) return;
    this.quantity--;
  }

  loadProduct() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id == null) return;
    this.shopService.getProductById(parseInt(id)).subscribe((res) => {
      this.product = res;
      this.breadCrumb.set('@productDetails', this.product.name);
    }, console.log);
  }
}

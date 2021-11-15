import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product?: IProduct;

  constructor(
    private shopService: ShopService,
    private activeRoute: ActivatedRoute,
    private breadCrumb: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
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

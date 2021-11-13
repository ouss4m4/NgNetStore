import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productList: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  shopParams = new ShopParams();
  sortOptions: { name: string; value: string }[] = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  count = 0;

  constructor(private shop: ShopService) {}

  ngOnInit() {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shop.getProducts(this.shopParams).subscribe((res) => {
      if (res) {
        this.productList = res.data;
        this.shopParams.pageIndex = res.pageIndex;
        this.shopParams.pageSize = res.pageSize;
        this.count = res.count;
      }
    }, console.log);
  }

  getBrands() {
    this.shop.getBrands().subscribe((res) => {
      this.brands = [{ id: 0, name: 'All' }, ...res];
    }, console.log);
  }

  getTypes() {
    this.shop.getTypes().subscribe((res) => {
      this.types = [{ id: 0, name: 'All' }, ...res];
    }, console.log);
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.shopParams.sort = target.value;
    this.getProducts();
  }

  onPageChanged(pageIndex: number) {
    this.shopParams.pageIndex = pageIndex;
    this.getProducts();
  }
}

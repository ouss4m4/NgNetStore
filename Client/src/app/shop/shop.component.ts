import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('search', { static: true }) searchInput?: ElementRef;
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

  onBrandSelected(brandId: string) {
    let id = parseInt(brandId, 10);
    this.shopParams.brandId = id;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: string) {
    let id = parseInt(typeId, 10);
    this.shopParams.typeId = id;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onSortSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.shopParams.sort = target.value;
    this.getProducts();
  }

  onPageChanged(newIndex: number) {
    if (this.shopParams.pageIndex !== newIndex) {
      this.shopParams.pageIndex = newIndex;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchInput?.nativeElement.value;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onReset() {
    this.shopParams.search = '';
    this.searchInput ? (this.searchInput.nativeElement.value = '') : null;
    this.getProducts();
  }
}

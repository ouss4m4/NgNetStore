import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map, tap } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];

  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandId) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    params = params.append('sort', shopParams.sort);

    params = params.append('pageIndex', shopParams.pageIndex.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());
    if (shopParams.search) params = params.append('search', shopParams.search);
    return this.http
      .get<IPagination>(this.baseUrl + '/products', {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.products = res.body!.data;
          return res.body;
        })
      );
  }

  getProductById(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + '/products/' + id);
  }
  getBrands() {
    if (this.brands.length) {
      return of(this.brands);
    }
    return this.http
      .get<IBrand[]>(this.baseUrl + '/products/brands')
      .pipe(tap((brands) => (this.brands = brands)));
  }

  getTypes() {
    if (this.types.length) {
      return of(this.types);
    }
    return this.http
      .get<IType[]>(this.baseUrl + '/products/types')
      .pipe(tap((types) => (this.types = types)));
  }
}

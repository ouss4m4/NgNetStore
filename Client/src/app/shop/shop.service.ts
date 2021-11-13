import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
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
    return this.http
      .get<IPagination>(this.baseUrl + '/products', {
        params,
        observe: 'response',
      })
      .pipe(map((res) => res.body));
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + '/products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + '/products/types');
  }
}

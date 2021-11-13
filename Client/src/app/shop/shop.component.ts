import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  prods: IProduct[] = [];
  constructor(private shop: ShopService) {}

  ngOnInit() {
    this.shop.getProducts().subscribe(
      (res) => {
        this.prods = res.data;
      },
      (err) => console.log(err)
    );
  }
}

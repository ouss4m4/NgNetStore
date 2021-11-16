import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../cart/cart.service';
import { ICart } from '../../shared/models/cart';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  cart$: Observable<ICart> = this.cartService.cart$;

  constructor(private cartService: CartService) {}
}

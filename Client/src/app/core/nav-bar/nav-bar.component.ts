import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { CartService } from '../../cart/cart.service';
import { ICart } from '../../shared/models/cart';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  cart$: Observable<ICart> = this.cartService.cart$;
  currentUser$ = this.accountService.currentUser$;
  constructor(
    private cartService: CartService,
    private accountService: AccountService
  ) {}
  logout() {
    this.accountService.logout();
  }
}

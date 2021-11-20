import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../cart/cart.service';
import { ICart } from '../../shared/models/cart';
import { IOrderToCreate } from '../../shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  submitOrder() {
    const cart = this.cartService.getCurrentCartValue();
    const orderToCreate: IOrderToCreate = this.getOrderToCreate(cart);
    this.checkoutService.createOrder(orderToCreate).subscribe(
      (order) => {
        this.toastr.success('Order created successfully');
        // this.cartService.abandonCart(cart);
        // this.cartService.clearCart();
        // const navExt: NavigationExtras = { state: order };
        // this.router.navigate(['checkout/success'], navExt);
      },
      (err) => {
        this.toastr.error(err.message);
        console.log(err);
      }
    );
  }
  getOrderToCreate(cart: ICart): IOrderToCreate {
    return {
      cartId: cart.id,
      deliveryMethodId: this.checkoutForm
        .get('deliveryForm')
        ?.get('deliveryMethod')?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value,
    };
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../cart/cart.service';
import { ICart } from '../../shared/models/cart';
import { IOrderToCreate } from '../../shared/models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe: any;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberInput!: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryInput!: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcInput!: ElementRef;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService
  ) {}

  onChange({ error }: any) {
    if (error) {
      this.cardErrors = error.message;
    } else {
      this.cardErrors = null;
    }
  }

  ngAfterViewInit() {
    this.stripe = Stripe(
      'pk_test_51Jxve9EURmvl3xIEJQ7MLMIxDxXyaTzLIgKQndPnggpzNJ4xEkBU8cQOZPY2TTGsSu9wsOlhz8oPMqpqfwkEx4AS00e9vc8VMe'
    );
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberInput.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryInput.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcInput.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

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

  ngOnDestroy() {
    this.cardCvc.destroy();
    this.cardExpiry.destroy();
    this.cardNumber.destroy();
  }
}

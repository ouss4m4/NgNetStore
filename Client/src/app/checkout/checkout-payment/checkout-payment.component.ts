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
  loading = false;

  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onChange(event: any) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        return;
      default:
        break;
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

  async submitOrder() {
    this.loading = true;
    const cart = this.cartService.getCurrentCartValue();
    try {
      const createdOrder = await this.createOrder(cart);
      const paymentResult = await this.confirmPaymentWithStripe(cart);
      if (paymentResult.paymentIntent) {
        // this.cartService.abandonCart(cart);
        this.cartService.abandonCart(cart);
        const navExt: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navExt);
      } else {
        this.toastr.error(paymentResult.error.message, 'Payment Failed');
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  private async confirmPaymentWithStripe(cart: ICart) {
    return this.stripe.confirmCardPayment(cart.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value,
        },
      },
    });
  }

  private async createOrder(cart: ICart) {
    const orderToCreate: IOrderToCreate = this.getOrderToCreate(cart);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
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

  shouldSubmitButtonDisable(): boolean {
    return (
      this.checkoutForm.get('paymentForm')?.invalid ||
      !this.cardNumberValid ||
      !this.cardExpiryValid ||
      !this.cardCvcValid ||
      this.loading
    );
  }

  ngOnDestroy() {
    this.cardCvc.destroy();
    this.cardExpiry.destroy();
    this.cardNumber.destroy();
  }
}

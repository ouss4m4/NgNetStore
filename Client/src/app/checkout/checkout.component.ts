import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { CartService } from '../cart/cart.service';
import { IOrderToCreate } from '../shared/models/order';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private cartService: CartService,
    private checkoutService: CheckoutService
  ) {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      }),
    });
  }

  ngOnInit() {
    this.accountService.getUserAddress().subscribe((address) => {
      if (address) {
        this.checkoutForm.get('addressForm')?.patchValue(address);
      }
    }, console.log);
    let cart = this.cartService.getCurrentCartValue();
    if (cart.deliveryMethodId !== null) {
      this.checkoutForm
        .get('deliveryForm')
        ?.get('deliveryMethod')
        ?.patchValue(cart.deliveryMethodId?.toString());
    }
  }
}

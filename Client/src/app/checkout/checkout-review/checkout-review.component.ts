import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent {
  @Input() appStepper!: CdkStepper;
  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  createPaymentIntent() {
    this.cartService.createPaymentIntent().subscribe((res) => {
      this.appStepper.next();
    }, console.log);
  }
}

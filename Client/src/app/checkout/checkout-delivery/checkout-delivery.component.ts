import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDeliveryMethod } from '../../shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  public deliveryMethods: IDeliveryMethod[] = [];
  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.checkoutService.getAvailableDelivery().subscribe((dms) => {
      this.deliveryMethods = dms;
    });
  }
}

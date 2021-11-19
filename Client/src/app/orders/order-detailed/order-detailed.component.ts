import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IOrder } from '../../shared/models/order';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  @Input() order?: IOrder;
  constructor(
    private activeRoute: ActivatedRoute,
    private breadCrumbs: BreadcrumbService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    let id = this.activeRoute.snapshot.paramMap.get('id') as string;
    this.orderService.getOrderDetailed(+id).subscribe((order) => {
      this.order = order;
      this.breadCrumbs.set(
        '@OrderDetailed',
        `Order# ${order.id} - ${order.status}`
      );
    }, console.log);
  }
}

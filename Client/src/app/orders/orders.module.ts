import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';
import { OrdersComponent } from './orders.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  {
    path: ':id',
    component: OrderDetailedComponent,
    data: { breadcrumb: { alias: 'orderDetailed' } },
  },
];
@NgModule({
  declarations: [OrderDetailedComponent, OrdersComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class OrdersModule {}

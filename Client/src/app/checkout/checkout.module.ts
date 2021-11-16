import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
];
@NgModule({
  declarations: [CheckoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CheckoutModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';

const Routes: Routes = [
  {
    path: '',
    component: CartComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(Routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}

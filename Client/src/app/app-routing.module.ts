import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: 'Home',
    },
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.module').then((mo) => mo.ShopModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then((mod) => mod.CartModule),
    data: {
      breadcrumb: 'Shopping Cart',
    },
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module').then((mod) => mod.CheckoutModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((mod) => mod.AccountModule),
    data: {
      breadcrumb: { skip: true },
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

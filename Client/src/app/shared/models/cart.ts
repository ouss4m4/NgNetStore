import { v4 } from 'uuid';
export interface ICart {
  id: string;
  items: ICartItem[];
  deliveryMethodId?: number;
  clientSecret?: string;
  paymentIntentId?: string;
  shippingPrice?: number;
}

export interface ICartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export class Cart implements ICart {
  id: string;
  items: ICartItem[];
  deliveryMethodId?: number | undefined;
  shippingPrice?: number | undefined;
  clientSecret?: string | undefined;
  paymentIntentId?: string | undefined;

  constructor(
    id = v4(),
    items = [],
    deliveryMethodId?: number,
    clientSecret?: string,
    paymentIntentId?: string,
    shippingPrice?: number
  ) {
    this.id = id;
    this.items = items;
    deliveryMethodId && (this.deliveryMethodId = deliveryMethodId);
    clientSecret && (this.clientSecret = clientSecret);
    paymentIntentId && (this.paymentIntentId = paymentIntentId);
    shippingPrice && (this.shippingPrice = shippingPrice);
  }
}

export interface ICartTotals {
  shipping: number;
  subtotal: number;
  total: number;
}

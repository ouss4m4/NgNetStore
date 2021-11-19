import { IAddress } from './user';

export interface IOrderToCreate {
  cartId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}

export interface IOrder {
  id: 0;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: IAddress;
  deliveryMethod: string;
  shippingPrice: number;
  orderItems: IOrderItem[];
  subtotal: number;
  total: number;
  status: string;
}

export interface IOrderItem {
  id: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

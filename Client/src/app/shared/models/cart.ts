import { v4 } from 'uuid';
export interface ICart {
  id: string;
  items: ICartItem[];
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

  constructor(id = v4(), items = []) {
    this.id = id;
    this.items = items;
  }
}

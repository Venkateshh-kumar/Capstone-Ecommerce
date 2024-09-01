
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartItems: CartItem[] = [];

  addToCart(item: CartItem): void {
    // Find if the item already exists in the cart
    const existingItem = this.cartItems.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
      // If it exists, increment the quantity
      existingItem.quantity += 1;
    } else {
      // If it doesn't exist, add it to the cart with a quantity of 1
      item.quantity = 1;
      this.cartItems.push(item);
    }

    // Notify all subscribers about the new state of the cart
    this.cartItemsSubject.next(this.cartItems);
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.cartItemsSubject.next(this.cartItems);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
}

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class CartComponent implements OnInit {
  constructor(private router: Router) {}
  cartItems: any[] = [];
  totalPrice: number = 0;

  private cartKey = 'cartItems'; // Key for localStorage

  ngOnInit(): void {
    this.loadCartItems();
    this.updateTotalPrice();
  }

  loadCartItems(): void {
    const items = localStorage.getItem(this.cartKey);
    this.cartItems = items ? JSON.parse(items) : [];
  }

  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
    this.saveCartItems();
    this.updateTotalPrice();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateTotalPrice(): void {
    this.totalPrice = this.getTotalPrice();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  private saveCartItems(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
  }
  
  
}

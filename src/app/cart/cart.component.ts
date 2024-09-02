
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;


  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.updateTotalPrice();
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  

  private decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  private getCartKey(): string {
    const token = localStorage.getItem('authToken');
    const decodedToken = this.decodeToken(token || '');
    console.log(decodedToken)
    return decodedToken && decodedToken.email ? `cart_${decodedToken.email}` : 'cartItems';
  }

  loadCartItems(): void {
    const cartKey = this.getCartKey();
    const items = localStorage.getItem(cartKey);
    const userId = localStorage.getItem("userId");

    // Check if items exist and parse it
    const parsedItems = items ? JSON.parse(items) : [];

    // Ensure parsedItems is an array
    if (Array.isArray(parsedItems)) {
        // Filter items by userId
        const data = parsedItems.filter((ele: any) => ele.userId === userId);
        console.log(data);

        this.cartItems = data;
    } else {
        console.error("Parsed items is not an array");
        this.cartItems = [];
    }
}


  private saveCartItems(): void {
    const cartKey = this.getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
  }

  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
    this.saveCartItems();
    this.updateTotalPrice();
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartItems();
    this.updateTotalPrice();
    this.showAddedToCartMessage();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartItems();
      this.updateTotalPrice();
    }
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

  private showAddedToCartMessage(): void {
    this.snackBar.open('Hurray! Your item is successfully added to the cart.', 'Close', {
      duration: 3000,
      verticalPosition: 'top', // You can also use 'bottom'
      horizontalPosition: 'center', // You can also use 'left', 'right' or 'center'
    });
  }
}

function jwt_decode(token: string): any {
  
  throw new Error('Function not implemented.');
}

// // import { Component, OnInit } from '@angular/core';
// // import { MatCardModule } from '@angular/material/card';
// // import { MatButtonModule } from '@angular/material/button';
// // import { CommonModule } from '@angular/common';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-cart',
// //   templateUrl: './cart.component.html',
// //   styleUrls: ['./cart.component.css'],
// //   standalone: true,
// //   imports: [CommonModule, MatCardModule, MatButtonModule]
// // })
// // export class CartComponent implements OnInit {
// //   constructor(private router: Router) {}
// //   cartItems: any[] = [];
// //   totalPrice: number = 0;

// //   private cartKey = 'cartItems'; // Key for localStorage

// //   ngOnInit(): void {
// //     this.loadCartItems();
// //     this.updateTotalPrice();
// //   }

// //   loadCartItems(): void {
// //     const items = localStorage.getItem(this.cartKey);
// //     this.cartItems = items ? JSON.parse(items) : [];
// //   }

// //   removeItem(item: any): void {
// //     this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
// //     this.saveCartItems();
// //     this.updateTotalPrice();
// //   }

// //   getTotalPrice(): number {
// //     return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// //   }

// //   updateTotalPrice(): void {
// //     this.totalPrice = this.getTotalPrice();
// //   }

// //   checkout(): void {
// //     this.router.navigate(['/checkout']);
// //   }

// //   private saveCartItems(): void {
// //     localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
// //   }
  
  
// // }


// import { Component, OnInit } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css'],
//   standalone: true,
//   imports: [CommonModule, MatCardModule, MatButtonModule]
// })
// export class CartComponent implements OnInit {
//   cartItems: any[] = [];
//   totalPrice: number = 0;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.loadCartItems();
//     this.updateTotalPrice();
//   }

//   // Decode JWT token to extract user information
//   private decodeToken(token: string): any {
//     try {
//       return jwt_decode(token);
//     } catch (error) {
//       console.error('Error decoding token', error);
//       return null;
//     }
//   }

//   // Get the unique cart key for the logged-in user
//   // private getCartKey(): string {
//   //   const token = localStorage.getItem('authToken'); // Assuming the JWT is stored under 'authToken'
//   //   const decodedToken = this.decodeToken(token || '');
//   //   return `cart_${decodedToken.email}`; // Using email as part of the key
//   // }
//   private getCartKey(): string {
//   const token = localStorage.getItem('authToken'); // Assuming the JWT is stored under 'authToken'
//   const decodedToken = this.decodeToken(token || '');
//   return decodedToken && decodedToken.email ? `cart_${decodedToken.email}` : 'cartItems';
// }


//   // Load cart items from localStorage
//   loadCartItems(): void {
//     const cartKey = this.getCartKey();
//     const items = localStorage.getItem(cartKey);
//     this.cartItems = items ? JSON.parse(items) : [];
//   }

//   // Save cart items to localStorage
//   private saveCartItems(): void {
//     const cartKey = this.getCartKey();
//     localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
//   }

//   // Remove item from cart
//   removeItem(item: any): void {
//     this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
//     this.saveCartItems();
//     this.updateTotalPrice();
//   }

//   // Calculate total price
//   getTotalPrice(): number {
//     return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   }

//   // Update total price
//   updateTotalPrice(): void {
//     this.totalPrice = this.getTotalPrice();
//   }

//   // Navigate to the checkout page
//   checkout(): void {
//     this.router.navigate(['/checkout']);
//   }
// }
// function jwt_decode(token: string): any {
//   throw new Error('Function not implemented.');
// }

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
    return decodedToken && decodedToken.email ? `cart_${decodedToken.email}` : 'cartItems';
  }

  loadCartItems(): void {
    const cartKey = this.getCartKey();
    const items = localStorage.getItem(cartKey);
    this.cartItems = items ? JSON.parse(items) : [];
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

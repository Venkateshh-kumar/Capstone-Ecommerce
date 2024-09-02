// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';

// @Component({
//   selector: 'app-shop',
//   templateUrl: './shop.component.html',
//   imports: [CommonModule, MatCardModule],
//   styleUrls: ['./shop.component.css'],
//   standalone: true
// })
// export class ShopComponent implements OnInit {
//   products: any[] = [];
//   filteredProducts: any[] = [];
//   categories: string[] = [];
//   loading = false;
//   errorMessage: string | null = null;
//   private cartKey = 'cartItems';  // Key for localStorage
//   private apiUrl = 'http://localhost:5000/api/products';  // Define apiUrl property
//   private categoriesUrl = 'http://localhost:5000/api/products/categories';  // Define categoriesUrl property
// selectedProduct: any;

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit(): void {
//     this.getCategories();
//     this.getProducts();
//   }

//   getCategories(): void {
//     this.http.get<string[]>(this.categoriesUrl).subscribe({
//       next: (data) => {
//         this.categories = data;
//       },
//       error: (error) => {
//         this.errorMessage = 'Failed to load categories. Please try again later.';
//       }
//     });
//   }

//   getProducts(category?: string): void {
//     this.loading = true;
//     this.errorMessage = null;
//     this.http.get<any[]>(this.apiUrl).subscribe({
//       next: (data) => {
//         this.products = data;
//         this.filteredProducts = category ? this.products.filter(product => product.category === category) : this.products;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.errorMessage = 'Failed to load products. Please try again later.';
//         this.loading = false;
//       }
//     });
//   }

//   onCategoryChange(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     const category = target.value;
//     this.getProducts(category);
//   }

//   // addToCart(product: any): void {
//   //   // Get existing cart items from localStorage
//   //   const existingCartItems = localStorage.getItem(this.cartKey);
//   //   const cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

//   //   // Check if the product is already in the cart
//   //   const existingProduct = cartItems.find((item: any) => item._id === product._id);

//   //   if (existingProduct) {
//   //     // Increase the quantity of the existing product
//   //     existingProduct.quantity = (existingProduct.quantity || 1) + 1;
//   //   } else {
//   //     // Add the new product to the cart with quantity 1
//   //     cartItems.push({ ...product, quantity: 1 });
//   //   }

//   //   // Save updated cart items to localStorage
//   //   localStorage.setItem(this.cartKey, JSON.stringify(cartItems));

//   //   // Navigate to cart page
//   //   this.router.navigate(['/cart']);
//   // }

//   addToCart(product: any): void {
//     const existingCartItems = localStorage.getItem(this.cartKey);
//     const cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];
//     const existingProduct = cartItems.find((item: any) => item._id === product._id);
  
//     if (existingProduct) {
//       existingProduct.quantity = (existingProduct.quantity || 1) + 1;
//     } else {
//       cartItems.push({ ...product, quantity: 1 });
//     }
  
//     localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
//     this.router.navigate(['/cart']);
//   }
  

//   isProductInCart(product: any): boolean {
//     const cartItems = localStorage.getItem(this.cartKey);
//     const cartProducts = cartItems ? JSON.parse(cartItems) : [];
//     return cartProducts.some((item: any) => item._id === product._id);
//   }

//   getCartItems(): any[] {
//     const cartItems = localStorage.getItem(this.cartKey);
//     return cartItems ? JSON.parse(cartItems) : [];
//   }

//   getTotalPrice(): number {
//     const cartItems = this.getCartItems();
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   }

//   getTotalItemCount(): number {
//     const cartItems = this.getCartItems();
//     return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  imports: [CommonModule, MatCardModule],
  styleUrls: ['./shop.component.css'],
  standalone: true
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  loading = false;
  errorMessage: string | null = null;
  private cartKey = 'cartItems';  // Key for localStorage
  private apiUrl = 'http://localhost:5000/api/products';  // Define apiUrl property
  private categoriesUrl = 'http://localhost:5000/api/products/categories';  // Define categoriesUrl property
  selectedProduct: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getCategories(): void {
    this.http.get<string[]>(this.categoriesUrl).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories. Please try again later.';
      }
    });
  }

  getProducts(category?: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = category ? this.products.filter(product => product.category === category) : this.products;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const category = target.value;
    this.getProducts(category);
  }
  addToCart(product: any, event: Event): void {
    event.stopPropagation(); // Prevent event from bubbling up to product card

    const existingCartItems: any = localStorage.getItem("cartItems");
    const cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];
    const userId = localStorage.getItem("userId");

    // Find if the product already exists in the cart for the current user
    const existingProduct = cartItems.find(
        (item: any) => item._id === product._id && item.userId === userId
    );

    if (existingProduct) {
        // If the product exists, increase its quantity
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        // If the product does not exist, add it with a quantity of 1
        cartItems.push({ ...product, quantity: 1, userId });
    }

    // Save the updated cart items back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Update the product object to show confirmation message
    product.addedToCart = true;

    // Show snackbar message
    this.snackBar.open('Your item has been successfully added to the cart.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
    });
}

  

  showProductInfo(product: any): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  isProductInCart(product: any): boolean {
    const cartItems = localStorage.getItem(this.cartKey);
    const cartProducts = cartItems ? JSON.parse(cartItems) : [];
    return cartProducts.some((item: any) => item._id === product._id);
  }

  getCartItems(): any[] {
    const cartItems = localStorage.getItem(this.cartKey);
    return cartItems ? JSON.parse(cartItems) : [];
  }

  getTotalPrice(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItemCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }
}



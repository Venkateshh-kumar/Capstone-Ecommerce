import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

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

  constructor(private http: HttpClient, private router: Router) {}

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

  addToCart(product: any): void {
    // Get existing cart items from localStorage
    const existingCartItems = localStorage.getItem(this.cartKey);
    const cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];

    // Check if the product is already in the cart
    const existingProduct = cartItems.find((item: any) => item._id === product._id);

    if (existingProduct) {
      // Increase the quantity of the existing product
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      // Add the new product to the cart with quantity 1
      cartItems.push({ ...product, quantity: 1 });
    }

    // Save updated cart items to localStorage
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));

    // Navigate to cart page
    this.router.navigate(['/cart']);
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

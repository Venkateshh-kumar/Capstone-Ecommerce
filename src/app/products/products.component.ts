import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./products.component.css'],
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  newProduct: any = {};
  editingProduct: any | null = null;
  showForm: 'add' | null = null;
  categories: string[] = [];
  loading = false;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5000/api/products';
  private categoriesUrl = 'http://localhost:5000/api/products/categories';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  // Fetch categories from the API
  getCategories(): void {
    this.http.get<string[]>(this.categoriesUrl).subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again later.';
      }
    });
  }

  // Fetch products from the API
  getProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded:', this.products);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Add a new product to the API
  addProduct(): void {
    if (this.newProduct.name && this.newProduct.price && this.newProduct.quantity !== undefined) {
      this.http.post(this.apiUrl, this.newProduct).subscribe({
        next: (data) => {
          console.log('Product added:', data);
          this.getProducts();
          this.toggleForm(); // Close form after adding product
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.errorMessage = 'Failed to add product. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  // Start editing a product
  startEditing(product: any): void {
    this.editingProduct = { ...product };
    console.log('Editing Product:', this.editingProduct);
  }

  // Update the product on the API
  updateProduct(): void {
    if (this.editingProduct) {
      this.http.put(`${this.apiUrl}/${this.editingProduct._id}`, this.editingProduct).subscribe({
        next: (data) => {
          console.log('Product updated:', data);
          this.getProducts();
          this.cancelEditing();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage = 'Failed to update product. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'No product selected for editing.';
    }
  }

  // Cancel editing mode
  cancelEditing(): void {
    this.editingProduct = null;
  }

  // Confirm and delete a product
  confirmDelete(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.deleteProduct(product);
    }
  }

  // Delete the product from the API
  deleteProduct(product: any): void {
    this.http.delete(`${this.apiUrl}/${product._id}`).subscribe({
      next: () => {
        console.log('Product deleted:', product);
        this.getProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.errorMessage = 'Failed to delete product. Please try again later.';
      }
    });
  }

  // Show the form for adding a new product
  showAddForm(): void {
    this.showForm = 'add';
    this.newProduct = {};
  }

  // Toggle the form visibility
  toggleForm(): void {
    this.showForm = null;
  }
}

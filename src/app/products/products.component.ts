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
  editingProduct: any = null;
  showForm: string | null = null;
  categories: string[] = ['chairs', 'tables', 'sofas'];
  loading = false;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5000/api/products';
  private categoriesUrl = 'http://localhost:5000/api/products/categories';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

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

  getProducts(): void {
    this.loading = true;
    this.errorMessage = null;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    if (this.newProduct.name && this.newProduct.price) {
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
    }
  }

  startEditing(product: any): void {
    this.editingProduct = { ...product };
    console.log('Editing Product:', this.editingProduct);
  }

  updateProduct(): void {
    if (this.editingProduct) {
      this.http.put(`${this.apiUrl}/${this.editingProduct._id}`, this.editingProduct).subscribe({
        next: (data) => {
          console.log('Product updated:', data);
          this.getProducts();
          this.editingProduct = null;
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage = 'Failed to update product. Please try again later.';
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingProduct = null;
  }

  confirmDelete(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.deleteProduct(product);
    }
  }

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

  showAddForm(): void {
    this.showForm = 'add';
    this.newProduct = {};
  }

  toggleForm(): void {
    this.showForm = null;
  }
}

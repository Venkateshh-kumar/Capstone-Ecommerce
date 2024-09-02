import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  })
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '' // Added UPI ID field
  };
  shippingDetails = {
    name: '',
    address: '',
    phone: '',
    email: '' // Added email field
  };
  selectedPaymentMethod: string = 'card'; // Default payment method
  paymentSuccess: boolean = false;

  private cartKey = 'cartItems';
  private apiUrl = 'http://localhost:5000/api/orders'; // API endpoint for orders
item: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotalPrice();
  }
  getTotalQuantity(){
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  loadCartItems(): void {
    const items = localStorage.getItem(this.cartKey);
    const userId = localStorage.getItem("userId");
    this.cartItems = items ? JSON.parse(items).filter((ele:any)=>ele.userId === userId) : [];
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  processPayment(): void {
    // Check for required fields based on selected payment method
    if (!this.shippingDetails.email) {
      alert('Please provide your email address.');
      return;
    }
  
    if (this.selectedPaymentMethod === 'card') {
      if (!this.paymentDetails.cardNumber || !this.paymentDetails.expiryDate || !this.paymentDetails.cvv) {
        alert('Please fill in all card details.');
        return;
      }
    } else if (this.selectedPaymentMethod === 'online') {
      if (!this.paymentDetails.upiId) {
        alert('Please provide your UPI ID.');
        return;
      }
    }
  
    // Prepare order data
    const orderData = {
      cartItems: this.cartItems,
      totalPrice: this.totalPrice,
      shippingDetails: this.shippingDetails,
      paymentDetails: this.paymentDetails
    };
  
    // Retrieve the JWT token from localStorage or another source
    const token = localStorage.getItem('authToken'); // Ensure this key matches where you store the token
  
    // Set up HTTP headers with Authorization token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    // Save order details to the server
    this.http.post(this.apiUrl, orderData, { headers }).subscribe({
      next: (response: any) => {
        // Clear the cart
        localStorage.removeItem(this.cartKey);
        this.cartItems = [];
        this.totalPrice = 0;
  
        // Show success message
        this.paymentSuccess = true;
  
        // Optionally, reset the form or hide the payment section
        this.shippingDetails = { name: '', address: '', phone: '', email: '' };
        this.paymentDetails = { cardNumber: '', expiryDate: '', cvv: '', upiId: '' }; // Reset all payment details
        this.selectedPaymentMethod = 'card'; // Reset payment method to default
      },
      error: (error) => {
        alert('Error processing payment.');
        console.error('Error:', error);
      }
    });
  }
  closePopup(): void {
    this.paymentSuccess = false;
    this.router.navigate(['/home']); // Redirect to the home page after closing the pop-up
  }

  navigateToOrders(){
    this.router.navigate(['/orders'])
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule]
})
export class OrderComponent implements OnInit {
  order: any = null;
  private apiUrl = 'http://localhost:5000/api/orders'; // API endpoint for orders

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the order ID from the route parameters
    const orderId = this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.fetchOrderDetails(orderId);
    }
  }

  fetchOrderDetails(orderId: string): void {
    this.http.get(`${this.apiUrl}/${orderId}`).subscribe({
      next: (response: any) => {
        this.order = response;
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
      }
    });
  }
}

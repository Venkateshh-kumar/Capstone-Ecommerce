import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [CommonModule, FormsModule,RouterLink]
})
export class SignUpComponent {
  signUpFullName: string = '';
  signUpEmail: string = '';
  signUpPhone: string = '';
  signUpPassword: string = '';
  signUpConfirmPassword: string = '';

  private apiUrl = 'http://localhost:5000/api/users'; // Correct API URL
isAdmin: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(): void {
    if (this.signUpPassword !== this.signUpConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.http.post<any>(`${this.apiUrl}/signup`, {
      fullName: this.signUpFullName,
      email: this.signUpEmail,
      phone: this.signUpPhone,
      password: this.signUpPassword
    }).subscribe(
      response => {
        console.log('Sign Up Successful', response);
        alert('Registration successful! Please sign in.');
        this.router.navigate(['/sign-in']); // Navigate to the Sign In page
      },
      error => {
        console.error('Sign Up Failed', error);
        alert('Registration failed: ' + (error.error.error || 'Unknown error'));
      }
    );
  }
}

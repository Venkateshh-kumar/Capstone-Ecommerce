import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path as needed

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentView: string = '';
  isAdmin: boolean = false ; // Ensure this is declared

  signInEmail: string = '';
  signInPassword: string = '';

  signUpFullName: string = '';
  signUpEmail: string = '';
  signUpPhone: string = '';
  signUpPassword: string = '';
  signUpConfirmPassword: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to admin status observable
    this.authService.getAdminStatus().subscribe(status => {
      this.isAdmin = status;
    });
  }

  showForm(view: string): void {
    this.currentView = view;
  }

  signIn() {
    // Add your sign-in logic here
    console.log('Sign-In form submitted:', this.signInEmail, this.signInPassword);
  }

  signUp() {
    if (this.signUpPassword === this.signUpConfirmPassword) {
      // Add your sign-up logic here
      console.log('Sign-Up form submitted:', this.signUpFullName, this.signUpEmail, this.signUpPhone, this.signUpPassword);
    } else {
      console.error('Passwords do not match');
    }
  }
}

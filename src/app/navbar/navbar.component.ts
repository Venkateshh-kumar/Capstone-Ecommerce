import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
  isAdmin: boolean = false;
  isUserLoggedIn: boolean = false;
  signInEmail: string = '';
  signInPassword: string = '';
  
  signUpFullName: string = '';
  signUpEmail: string = '';
  signUpPhone: string = '';
  signUpPassword: string = '';
  signUpConfirmPassword: string = '';

  isSidebarOpen = false;
  isDisabled = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to admin status observable
    this.authService.getAdminStatus().subscribe(status => {
      this.isAdmin = status;
    });

    // Check if the user is authenticated
    this.isUserLoggedIn = this.authService.isAuthenticated();
  }

  signIn() {
    this.authService.signIn(this.signInEmail, this.signInPassword).subscribe(response => {
      if (response) {
        this.isUserLoggedIn = true;
        console.log('User signed in:', this.signInEmail);
      } else {
        console.error('Sign-in failed');
      }
    });
  }

  signUp() {
    if (this.signUpPassword === this.signUpConfirmPassword) {
      this.authService.signUp(this.signUpFullName, this.signUpEmail, this.signUpPhone, this.signUpPassword).subscribe(response => {
        if (response) {
          console.log('User signed up:', this.signUpEmail);
        } else {
          console.error('Sign-up failed');
        }
      });
    } else {
      console.error('Passwords do not match');
    }
  }

  toggleSidebar(): void {
    if (this.isDisabled) return; // Prevent toggle if disabled
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  // Method to enable or disable the hamburger button
  setButtonState(enabled: boolean): void {
    this.isDisabled = !enabled;
  }

  logout() {
    this.authService.logout();
    this.isUserLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/home']);
  }
}

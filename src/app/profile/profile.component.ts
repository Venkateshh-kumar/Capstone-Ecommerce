import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      response => {
        // Check if the user object is correctly assigned
        this.user = response; // Adjust according to your API response
      },
      error => {
        console.error('Error fetching profile:', error);
        this.router.navigate(['/sign-in']); // Redirect to sign-in if there's an error
      }
    );
  }

  profileLogout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.router.navigate(['/sign-in']);
  }
}

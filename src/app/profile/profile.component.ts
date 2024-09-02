import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      response => {
        this.user = response.user;
      },
      error => {
        console.error('Error fetching profile:', error);
        this.router.navigate(['/sign-in']); // Redirect to sign-in if there's an error
      }
    );
  }

  profileLogout(){
    this.authService.logout(); // Call the logout method from AuthService
    this.router.navigate(['/sign-in']);

  }
}
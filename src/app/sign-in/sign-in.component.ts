import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [CommonModule, FormsModule,RouterLink]
})
export class SignInComponent {
  signInEmail: string = '';
  signInPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn(): void {
    
    this.authService.signIn(this.signInEmail, this.signInPassword).subscribe(
      response => {
        // console.log('Sign In Successful', response.user._id);
        localStorage.setItem("userId", response.user._id)
        alert("Successfully signed in")
        this.router.navigate(['/shop']);

      },
      error => {
        console.error('Sign In Failed', error);
        alert('Invalid credentials');
      }
    );
  }
}

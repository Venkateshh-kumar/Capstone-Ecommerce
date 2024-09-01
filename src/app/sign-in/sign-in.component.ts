import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SignInComponent {
  signInEmail: string = '';
  signInPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn(): void {
    console.log("hello")
    this.authService.signIn(this.signInEmail, this.signInPassword).subscribe(
      response => {
        console.log('Sign In Successful', response);
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Sign In Failed', error);
        alert('Invalid credentials');
      }
    );
  }
}

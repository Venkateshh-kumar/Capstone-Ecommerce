
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5000/api/users'; // Updated endpoint
//   private adminCredentials = {
//     email: 'admin@gmail.com',
//     password: 'adminpass'
//   };

//   private adminStatus = new BehaviorSubject<boolean>(false); // Holds the admin status

//   constructor(private http: HttpClient) {}

//   // Method to sign in and check if the user is an admin
//   signIn(email: string, password: string): Observable<any> {
//     // Admin check
//     if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
//       this.adminStatus.next(true); // Set admin status to true
//       return new Observable(observer => {
//         observer.next({ isAdmin: true });
//         observer.complete();
//       });
//     }

//     // Regular user check
//     return this.http.post<any>(`${this.apiUrl}/signin`, { email, password }).pipe(
//       tap(response => {
//         // Update admin status based on response
//         this.adminStatus.next(response.isAdmin || false);
//       }),
//       catchError(error => {
//         // Handle error, e.g., log it or notify the user
//         console.error('Sign In Error:', error);
//         throw error; // Rethrow error to be handled by subscriber
//       })
//     );
//   }

//   // Method to get the current admin status as an observable
//   getAdminStatus(): Observable<boolean> {
//     return this.adminStatus.asObservable();
//   }

//   // Method to sign up a new user
//   signUp(fullName: string, email: string, phone: string, password: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/signup`, { fullName, email, phone, password }).pipe(
//       catchError(error => {
//         // Handle error, e.g., log it or notify the user
//         console.error('Sign Up Error:', error);
//         throw error; // Rethrow error to be handled by subscriber
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users'; // Updated endpoint
  private adminCredentials = {
    email: 'admin@gmail.com',
    password: 'adminpass'
  };
  private TOKEN_KEY = 'authToken'; // Key for storing the token

  private adminStatus = new BehaviorSubject<boolean>(false); // Holds the admin status

  constructor(private http: HttpClient) {}

  // Method to sign in and check if the user is an admin
  signIn(email: string, password: string): Observable<any> {
    // Admin check
    if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
      this.adminStatus.next(true); // Set admin status to true
      return new Observable(observer => {
        const token = 'your-admin-token'; // Admin token (if needed)
        this.storeToken(token);
        observer.next({ isAdmin: true });
        observer.complete();
      });
    }

    // Regular user check
    return this.http.post<any>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap(response => {
        // Save the JWT token
        this.storeToken(response.token);
        // Update admin status based on response
        this.adminStatus.next(response.isAdmin || false);
      }),
      catchError(error => {
        // Handle error, e.g., log it or notify the user
        console.error('Sign In Error:', error);
        throw error; // Rethrow error to be handled by subscriber
      })
    );
  }

  // Method to get the current admin status as an observable
  getAdminStatus(): Observable<boolean> {
    return this.adminStatus.asObservable();
  }

  // Method to sign up a new user
  signUp(fullName: string, email: string, phone: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { fullName, email, phone, password }).pipe(
      catchError(error => {
        // Handle error, e.g., log it or notify the user
        console.error('Sign Up Error:', error);
        throw error; // Rethrow error to be handled by subscriber
      })
    );
  }

  // Method to store the JWT token in local storage
  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Method to retrieve the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Method to remove the token from local storage (e.g., on logout)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.adminStatus.next(false); // Reset admin status
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

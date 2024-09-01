import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAdminStatus().pipe(
      map(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/home']); // Redirect if not an admin
          return false;
        }
        return true;
      })
    );
  }
}

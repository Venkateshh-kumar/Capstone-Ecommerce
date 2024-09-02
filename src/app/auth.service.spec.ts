import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpTestingController
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController; // Inject HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController); // Initialize HttpTestingController
    localStorage.clear(); // Clear localStorage before each test
  });

  afterEach(() => {
    httpMock.verify(); // Verify that there are no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in as regular user', () => {
    const email = 'user@example.com';
    const password = 'userpass';
    const mockResponse = { token: 'user-token', isAdmin: false };

    service.signIn(email, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe(mockResponse.token);
    });

    // Expect HTTP request for regular sign-in
    const req = httpMock.expectOne(`${service['apiUrl']}/signin`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle sign in error', () => {
    const email = 'user@example.com';
    const password = 'userpass';

    service.signIn(email, password).subscribe(
      () => fail('Expected an error, but the request succeeded'),
      error => {
        expect(error.status).toBe(500);
        expect(localStorage.getItem('authToken')).toBeNull();
      }
    );

    // Expect HTTP request for sign-in
    const req = httpMock.expectOne(`${service['apiUrl']}/signin`);
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });

  it('should sign up a new user', () => {
    const newUser = { fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password' };
    const mockResponse = { success: true };

    service.signUp(newUser.fullName, newUser.email, newUser.phone, newUser.password).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Expect HTTP request for sign-up
    const req = httpMock.expectOne(`${service['apiUrl']}/signup`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return true if the user is authenticated', () => {
    localStorage.setItem('authToken', 'some-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if the user is not authenticated', () => {
    localStorage.removeItem('authToken');
    expect(service.isAuthenticated()).toBeFalse();
  });
});

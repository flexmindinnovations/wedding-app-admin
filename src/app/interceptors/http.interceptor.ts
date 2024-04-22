import { Injectable, inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    sharedService = inject(SharedService);
    isTokenValid = true;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem('token');
        if (authToken) {
            const expiryDate = this.getTokenExpirationDate(authToken);
            this.isTokenValid = expiryDate && expiryDate > new Date() ? true : false;
        }
        if (!req.url.includes('login') || !req.url.includes('createToken') || !req.url.includes('register')) {
            if (this.isTokenValid) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            } else {
                this.sharedService.isUnAuthorizedRequest.next(true);
            }
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle the error here (e.g., log it, show a notification, etc.)
                // console.error('HTTP Error:', error);
                return throwError(() => error);
            })
        );
    }

    getTokenExpirationDate(token: string): any {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp === undefined) {
                return null;
            }
            const date = new Date(0); // Initialize with epoch time
            date.setUTCSeconds(decodedToken.exp); // Set seconds since epoch
            return date;
        } catch (error) {
            return null;
        }
    }
}
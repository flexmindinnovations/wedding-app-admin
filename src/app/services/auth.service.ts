import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpConfigService } from './http-config.service';
import { environment } from 'src/environments/environment';
import * as bcrypt from 'bcryptjs';
import { getSalt } from 'src/util/util';
import { AlertService } from './alert/alert.service';
import { AlertType } from '../enums/alert-types';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpConfigService);
  alert = inject(AlertService);
  endpoint = environment.endpoint + '/api/Token';
  sharedService = inject(SharedService);
  constructor() { }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/createToken`, payload).pipe(
      tap((data: any) => {
        if (data) {
          const { user } = data;
          if (user) {
            console.log('user: ', user);
            const { token, roleName, firstName, lastName, middleName, mobileNo, emailId, permissionList } = user;
            const salt = getSalt(10);
            const profile = { firstName, lastName, middleName, mobileNo, emailId };
            localStorage.setItem('token', token);
            localStorage.setItem('role', bcrypt.hashSync(roleName, salt));
            localStorage.setItem('profile', JSON.stringify(profile));
          } else {
            this.alert.setAlertMessage('Invalid username or password', AlertType.error);
          }
        }
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}

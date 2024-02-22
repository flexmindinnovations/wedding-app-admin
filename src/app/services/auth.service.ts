import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    // const token = localStorage.getItem('token');
    const user: any = JSON.parse(localStorage.getItem('user') || '{}');
    if(user?.username === 'admin' && user?.password === 'admin') return true;
    else return false;
    // return !!token;
  }
}

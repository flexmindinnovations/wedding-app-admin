import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  iconSrc = '/assets/icon/user.png';
  router = inject(Router);

  constructor() { }

  ngOnInit() { }


  handleImageLoadError(event: ErrorEvent) {
  }

  handleUserSIgnOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }
}

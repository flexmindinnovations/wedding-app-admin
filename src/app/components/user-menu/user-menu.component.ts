import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {

  iconSrc = '/assets/icon/user.png';

  constructor() { }

  ngOnInit() { }


  handleImageLoadError(event: ErrorEvent) {
  }
}

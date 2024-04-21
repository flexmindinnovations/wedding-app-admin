import { SharedService } from 'src/app/services/shared.service';
import { AfterContentInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit, AfterContentInit {
  iconSrc = '/assets/icon/user.png';
  router = inject(Router);
  profileInfo: any = {};
  sharedService = inject(SharedService);
  @ViewChild('menu', {static: true}) menuEl!: Menu;


  profileItems: MenuItem[] = [
    {
      items: [
        // {
        //   label: 'Profile',
        //   icon: 'pi pi-user',
        //   focus: false,
        //   command: () => {
        //     // this.router.navigateByUrl('profile/personal');
        //   }
        // },
        // {
        //   separator: true
        // },
        {
          label: 'Logout',
          styleClass: 'logout-option',
          icon: 'pi pi-sign-out',
          command: () => {
            this.menuEl.hide();
            this.handleUserSignOut();
          }
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() { }

  ngAfterContentInit(): void {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.profileInfo = profile ? profile : {};
  }

  handleImageLoadError(event: ErrorEvent) {
  }


  handleUserSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.router.navigateByUrl('login');
    this.sharedService.logoutCall.next(true);
  }
}

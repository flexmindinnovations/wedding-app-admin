import { SharedService } from 'src/app/services/shared.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ThemeService } from 'src/app/services/theme.service';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit, AfterViewInit {
  iconSrc = '/assets/icon/user.png';
  router = inject(Router);
  profileInfo: any = {};
  sharedService = inject(SharedService);
  themeService = inject(ThemeService);
  cdref = inject(ChangeDetectorRef);
  @ViewChild('menu', { static: false }) menuEl!: Menu;
  cTheme: string = 'light';


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
          command: (event: any) => {
            this.handleUserSignOut(event);
          }
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.profileInfo = profile ? profile : {};
    this.cTheme = localStorage.getItem('color-theme') || 'light';
    this.iconSrc = this.cTheme === 'light' ? '/assets/icon/user.png' : '/assets/icon/user_white.png';
    this.themeService.getThemeToggle().subscribe((cTheme: any) => {
      this.cTheme = cTheme;
      this.iconSrc = this.cTheme === 'light' ? '/assets/icon/user.png' : '/assets/icon/user_white.png';
    });
    this.cdref.detectChanges();
  }

  handleImageLoadError(event: ErrorEvent) {
  }


  handleUserSignOut(event: any) {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.menuEl.toggle(event);
    this.sharedService.logoutCall.next(true);
    setTimeout(() => {
      this.router.navigateByUrl('login');
    })
  }
}

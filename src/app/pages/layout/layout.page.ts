import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, Input, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { nestedRoutes } from 'src/util/util';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit, AfterViewInit {

  @Input() isCollapsed: boolean = false;
  selectedTheme = 'dark';
  router = inject(Router);
  titleCasePipe = inject(TitleCasePipe);
  sidebarItemService = inject(SidebarItemsService);

  menuClassess = {
    collapsed: `delay-150 duration-300 ease-out md:!w-[8%] lg:!w-[5%] md:max-w-[25%] lg:max-w-[25%]`,
    expanded: `delay-150 duration-300 ease-out md:w-[20%] lg:w-[15%] md:max-w-[25%] lg:max-w-[25%]`
  }

  idleState = "NOT_STARTED";
  countdown?: number | any = null;
  lastPing?: Date | any = null;
  isTimeOut: boolean = false;

  showLogoutModal = false;
  showSessionExpiredDialog = false;
  isRedirecting = false;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private authService: AuthService,
    private cdref: ChangeDetectorRef,
    private modalController: ModalController,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    // const exp = this.authService.decodeToken(token);
    // if (exp && exp * 1000 < Date.now()) {
    //   this.idleState = "TIMED_OUT";
    //   this.authService.logoutUser();
    //   setTimeout(() => {
    //     this.isTimeOut = false;
    //     this.cdref.detectChanges();
    //     this.modalController.dismiss();
    //     setTimeout(() => { this.router.navigateByUrl('login'); }, 100)
    //   }, 1000)
    // }
    // this.reset();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          const url = event.url;
          const activeRoute = url.substring(url.lastIndexOf('/') + 1, url.length);
          this.sidebarItemService.setCurrentPage(this.titleCasePipe.transform(activeRoute));
        }
      }
    })

    this.idle.setIdle(5000);
    this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleStart.subscribe(() => {
      // console.log('idle: ', this.idle);

      this.idleState = "IDLE";
      this.isTimeOut = true;
    });
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      this.countdown = null;
      this.cdref.detectChanges();
    });
    this.idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT";
      this.authService.logoutUser();
      setTimeout(() => {
        this.isTimeOut = false;
        this.cdref.detectChanges();
        this.modalController.dismiss();
        setTimeout(() => { this.router.navigateByUrl('login'); }, 100)
      }, 1000)
    });
    this.idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);
    this.keepalive.interval(3);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  reset() {
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngAfterViewInit(): void {
    window.onpopstate = (event: any) => {
      const url = window.location.href;
      const routeSplitted = url.split('/');
      const isNestedRoute = nestedRoutes.includes(routeSplitted[1]);
      let activeRoute: any;
      if (isNestedRoute) activeRoute = url.split('/');
      else activeRoute = url.substring(url.lastIndexOf('/') + 1, url.length);
      this.sidebarItemService.setCurrentRoute(activeRoute ? activeRoute : '');
    }

    this.sharedService.isUnAuthorizedRequest.subscribe((isUnAuthorizedRequest: any) => {
      if (isUnAuthorizedRequest) {
        this.showSessionExpiredDialog = true;
        this.cdr.detectChanges();
      }
    })
  }

  handleSignIn() {
    this.authService.logoutUser();
    this.isRedirecting = true;
    of(true)
      .pipe(
        delay(1500)
      ).subscribe(() => {
        this.showSessionExpiredDialog = false;
        this.isRedirecting = false;
        setTimeout(() => {
          this.router.navigateByUrl('login');
        })
      })
  }

  handleIsCollapsed(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }

  logoutUser() {
    this.authService.logoutUser();
    this.showLogoutModal = true;
    this.sharedService.isLoggedOutCompleted.next(true);
    of(true)
      .pipe(
        delay(1500)
      ).subscribe(() => {
        this.isTimeOut = false;
        this.showLogoutModal = false;
        setTimeout(() => {
          this.router.navigateByUrl('login');
        })
      });
  }

  ngOnDestroy() {
    this.isTimeOut = false;
  }
}

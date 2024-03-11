import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, Input, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { nestedRoutes } from 'src/util/util';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';

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

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private authService: AuthService,
    private cdref: ChangeDetectorRef,
    private modalController: ModalController
  ) {
    idle.setIdle(5000);
    idle.setTimeout(5);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
      this.isTimeOut = true;
    });
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      this.countdown = null;
      cdref.detectChanges();
    });
    idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT";
      this.authService.logoutUser();
      setTimeout(() => {
        this.isTimeOut = false;
        cdref.detectChanges();
        this.modalController.dismiss();
        setTimeout(() => { this.router.navigateByUrl('login'); }, 100)
      }, 1000)
    });
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  ngOnInit(): void {
    this.reset();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          const url = event.url;
          const activeRoute = url.substring(url.lastIndexOf('/') + 1, url.length);
          this.sidebarItemService.setCurrentPage(this.titleCasePipe.transform(activeRoute));
        }
      }
    })
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
  }

  handleIsCollapsed(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }

  ngOnDestroy() {
    this.isTimeOut = false;
  }
}

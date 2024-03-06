import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { nestedRoutes } from 'src/util/util';

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

  constructor() { }

  ngOnInit(): void {
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
}

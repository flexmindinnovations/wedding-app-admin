import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SidebarItemsService } from './services/sidebar-items.service';
import { COLOR_SCHEME } from 'src/util/util';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed: boolean = false;
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
    initFlowbite();
    localStorage.setItem('color-scheme', COLOR_SCHEME);
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

  handleIsCollapsed(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }
}

import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { SidebarItemsService } from 'src/app/services/sidebar-items.service';
import { DOMAIN } from 'src/util/util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentPage: any;
  sidebarItemService = inject(SidebarItemsService);
  themeToggle = false;
  router = inject(Router);
  pageTitle = inject(Title);
  route = inject(ActivatedRoute);
  @Output() showMobileMenu = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.getCurrentPage();

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const navigation: any = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        route: string,
        pageName: string,
        title: string
      };
      this.currentPage = state ? state.title : '';
      const pageTitle = `${DOMAIN} | ${state ? state.title : ''}`;
      this.pageTitle.setTitle(pageTitle);
    });
  }

  getCurrentPage() {
    this.sidebarItemService.getCurrentPage().subscribe({
      next: (data: any) => {
        this.currentPage = data.title ? data?.title : data;
      }
    })
  }

  handleMobileMenuClick() {
    this.showMobileMenu.emit(true);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SideBarItem } from '../interfaces/sidebar';

@Injectable({
  providedIn: 'root'
})
export class SidebarItemsService {

  http = inject(HttpClient);

  currentPage = new Subject<{}>();

  getSidebarItems(): Observable<SideBarItem[]> {
    return this.http.get<SideBarItem[]>('../../assets/data/sidebar-items.json');
  }

  setCurrentPage(pageName: {}) {
    this.currentPage.next(pageName);
  }

  getCurrentPage(): Observable<{}> {
    return this.currentPage.asObservable();
  }

}

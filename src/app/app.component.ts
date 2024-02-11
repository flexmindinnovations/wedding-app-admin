import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed: boolean = false;
  selectedTheme = 'dark';

  constructor() { }

  ngOnInit(): void {
    initFlowbite();
    // document.documentElement.setAttribute('data-theme', this.selectedTheme);
  }

  handleIsCollapsed(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
  }
}

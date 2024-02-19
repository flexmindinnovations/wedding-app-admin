import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-dropdown',
  templateUrl: './theme-dropdown.component.html',
  styleUrls: ['./theme-dropdown.component.scss'],
})
export class ThemeDropdownComponent  implements OnInit {
  toggleIcon: any = 'down';
  isOpen: boolean = false;

  constructor() { }

  ngOnInit() {}

  handleToggle() {
    this.isOpen = !this.isOpen;
    this.toggleIcon = this.isOpen ? 'up' : 'down';
  }

}

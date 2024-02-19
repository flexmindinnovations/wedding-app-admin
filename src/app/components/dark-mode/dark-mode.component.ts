import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-dark-mode',
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss'],
})
export class DarkModeComponent implements OnInit {
  iconMode = '☀️';
  isLightMode = true;
  themeService = inject(ThemeService);
  constructor() { }

  ngOnInit() { }

  handleDarkModeToggle() {
    this.isLightMode = !this.isLightMode;
    this.iconMode = this.isLightMode ? '☀️' : '🌙';
    const colorTheme = this.isLightMode ? 'light' : 'dark';
    localStorage.setItem('color-theme', colorTheme);
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.themeService.setThemeToggle(colorTheme);

  }

}

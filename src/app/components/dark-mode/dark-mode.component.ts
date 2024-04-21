import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-dark-mode',
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss'],
})
export class DarkModeComponent implements OnInit, AfterViewInit {
  iconMode = '☀️';
  isLightMode = true;
  themeService = inject(ThemeService);
  // themeLinkElement: HTMLLinkElement;
  // lightThemeSrc = 'node_modules/primeng/resources/themes/fluent-light/theme.css';
  // darkThemeSrc = 'node_modules/primeng/resources/themes/viva-dark/theme.css';
  constructor() {
    // this.themeLinkElement = <HTMLLinkElement>document.getElementById('app-theme');
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.isLightMode = localStorage.getItem('color-theme') === 'dark' ? false : true;
    // this.themeLinkElement.href = this.isLightMode ? this.lightThemeSrc : this.darkThemeSrc;
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

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
    localStorage.setItem('color-theme', colorTheme);
    // this.themeLinkElement.href = this.isLightMode ? this.lightThemeSrc : this.darkThemeSrc;
  }

}

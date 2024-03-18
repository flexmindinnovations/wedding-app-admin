import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent implements OnInit {
  @Input() columnDefs: ColDef[] = [];
  @Input() rowDefs: any[] = [];
  @Input() gridSize: 'sm' | 'lg' = 'sm';
  @Input('height') gridHeight: any = '300px';
  themeName: any = 'ag-theme-themeName ag-data-grid';
  agGridTheme = 'balham';
  themeService = inject(ThemeService);

  @ViewChild(AgGridAngular, { static: true }) agGrid!: AgGridAngular;


  ngOnInit() {
    this.themeService.getThemeToggle().subscribe((theme: string) => {
      const toggleTheme = theme === 'dark' ? `ag-theme-${this.agGridTheme}-${theme} ag-data-grid` : `ag-theme-${this.agGridTheme} ag-data-grid`;
      this.themeName = toggleTheme;
      this.gridHeight = this.gridHeight ? `full-height` : 'fixed-height';
    })
  }

  ngAfterViewInit() {
    this.gridHeight = this.gridHeight ? `full-height` : 'fixed-height';
  }


  onGridReady(event: GridReadyEvent<any, any>) {
    // console.log('Grid Ready: ', event);
    const currentTheme = localStorage.getItem('color-theme') || 'light';
    const toggleTheme = currentTheme === 'dark' ? `ag-theme-${this.agGridTheme}-${currentTheme} ag-data-grid` : `ag-theme-${this.agGridTheme} ag-data-grid`;
    this.themeName = toggleTheme;
  }

}

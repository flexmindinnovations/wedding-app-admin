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
  @Input('height') gridHeight: any;
  themeName: any = 'ag-theme-quartz ag-data-grid';
  themeService = inject(ThemeService);

  @ViewChild(AgGridAngular, { static: true }) agGrid!: AgGridAngular;


  ngOnInit() {
    console.log('rowDefs: ', this.rowDefs);
    
    const currentTheme = localStorage.getItem('color-theme') || 'light';
    const themeApplied = this.themeName.replace('{{theme}}', currentTheme === 'dark' ? `quartz-${currentTheme}` : 'quartz');
    this.themeName = themeApplied;
    this.themeService.getThemeToggle().subscribe((theme: string) => {
      const toggleTheme = theme === 'dark' ? `ag-theme-quartz-${theme} ag-data-grid` : 'ag-theme-quartz ag-data-grid';
      this.themeName = toggleTheme;
    })
  }

  ngAfterViewInit() {
    this.gridHeight = this.gridHeight ? `full-height` : 'fixed-height';

  }


  onGridReady(event: GridReadyEvent<any, any>) {
    // console.log('Grid Ready: ', event);
  }

}

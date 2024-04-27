import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { ThemeService } from 'src/app/services/theme.service';
import { v4 as uuidv4 } from 'uuid';

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
  @Input() showFilter: boolean = false;
  @Input() showAddButton: boolean = false;
  @Input() addButtonTitle: string = 'Add';
  @Output() buttonAction: EventEmitter<any> = new EventEmitter();
  themeName: any = 'ag-theme-themeName ag-data-grid';
  agGridTheme = 'balham';
  themeService = inject(ThemeService);
  id = uuidv4();

  @ViewChild(AgGridAngular, { static: true }) agGrid!: AgGridAngular;

  gridApi!: GridApi;

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


  onGridReady(params: GridReadyEvent<any, any>) {
    this.gridApi = params.api;
    const currentTheme = localStorage.getItem('color-theme') || 'light';
    const toggleTheme = currentTheme === 'dark' ? `ag-theme-${this.agGridTheme}-${currentTheme} ag-data-grid` : `ag-theme-${this.agGridTheme} ag-data-grid`;
    this.themeName = toggleTheme;
  }

  onFilterTextBoxChanged(event: any) {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById(this.id) as HTMLInputElement).value.toString(),
    );
  }

  quickFilterParser(quickFilter: string) {
    let quickFilterParts = [];
    let lastSpaceIndex = -1;
    const isQuote = (index: number) => quickFilter[index] === '"';
    const getQuickFilterPart = (
      lastSpaceIndex: number,
      currentIndex: number,
    ) => {
      const startsWithQuote = isQuote(lastSpaceIndex + 1);
      const endsWithQuote = isQuote(currentIndex - 1);
      const startIndex =
        startsWithQuote && endsWithQuote
          ? lastSpaceIndex + 2
          : lastSpaceIndex + 1;
      const endIndex =
        startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
      return quickFilter.slice(startIndex, endIndex);
    };
    for (let i = 0; i < quickFilter.length; i++) {
      const char = quickFilter[i];
      if (char === " ") {
        if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
          quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
          lastSpaceIndex = i;
        }
      }
    }
    if (lastSpaceIndex !== quickFilter.length - 1) {
      quickFilterParts.push(
        getQuickFilterPart(lastSpaceIndex, quickFilter.length),
      );
    }
    return quickFilterParts;
  }

  quickFilterMatcher(
    quickFilterParts: string[],
    rowQuickFilterAggregateText: string,
  ) {
    return quickFilterParts.every((part) =>
      rowQuickFilterAggregateText.match(part),
    );
  }

  handleClick() {
    this.buttonAction.emit();
  }

}

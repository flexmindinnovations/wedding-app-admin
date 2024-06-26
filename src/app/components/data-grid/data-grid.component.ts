import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { ThemeService } from 'src/app/services/theme.service';
import { v4 as uuidv4 } from 'uuid';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from 'src/environments/environment';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as moment from 'moment';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


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
  @Input() showExport: boolean = false;
  @Input() showAddButton: boolean = false;
  @Input() addButtonTitle: string = 'Add';
  @Output() buttonAction: EventEmitter<any> = new EventEmitter();
  themeName: any = 'ag-theme-themeName ag-data-grid';
  agGridTheme = 'balham';
  themeService = inject(ThemeService);
  id = uuidv4();
  isLoading: boolean = false;

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

  async exportToPDF() {
    this.isLoading = true;
    const doc = await this.getDocument();
    pdfMake.createPdf(doc).open();
  }

  async getDocument() {
    const tableData = await this.getTableData();
    let bodyData = await this.buildTableBody(tableData.header, tableData.rows);
    const headerRow = tableData?.header.map((item: any) => {
      let value = item;
      if (item === 'Customer Id') value = '#id';
      if (item === 'Registration Date') value = 'Reg Date';
      if (item === 'Is Active') value = 'Status';
      return value;
    });

    bodyData = [headerRow, ...bodyData];
    const user = JSON.parse(localStorage.getItem('profile') || '');
    const fullName = user?.firstName + ' ' + user?.lastName;
    const generateDate = moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");
    const logoImageSrc = `${window.location.origin}/assets/icon/logo.png`;
    const doc: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'portrait', // can also be 'landscape'
      content: [
        {
          image: await <any>this.getBase64ImageFromURL(logoImageSrc),
          height: 50,
          width: 100,
          style: {
            alignment: 'center',
            margin: [20, 40]
          }
        },
        {
          alignment: 'left',
          margin: [0, 10],
          columns: [
            {
              width: '*',
              fontSize: 10,
              bold: true,
              text: `Generated By: ${fullName}`
            },
            {
              width: '*',
              fontSize: 10,
              bold: true,
              text: `Generated On: ${generateDate}`
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'left',
              width: '*',
              margin: [0, 10, 0, 0],
              table: {
                headerRows: 1,
                heights: 'auto',
                // heights: (rowIndex => rowIndex === 0 ? 15 : 'auto'),
                widths: [15, 'auto', 'auto', 'auto', 60, 40],
                body: bodyData,
              },
              style: 'row',
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  // return (rowIndex > 0 && rowIndex % 2 === 0) ? '#6c84ee' : '#36acfa';
                  return (rowIndex === 0 ? '#ccc' : null)
                },
              }
            },
          ]
        }
      ],
      styles: {
        subheader: {
          fontSize: 12,
          margin: [0, 10, 0, 10],
          bold: true,
        },
        row: {
          fontSize: 10,
          // color: '#fff',
          alignment: 'left',
          margin: [0, 5, 0, 5],
        }
      }
    };
    this.isLoading = false;
    return doc;
  }

  async getTableData() {
    console.log('columnDefs: ', this.columnDefs);
    
    const columns = this.columnDefs.map((col: any) => {
      let fieldName = col.field;
      if (fieldName === 'imagePath1') fieldName = 'Photo';
      let colName = fieldName[0].toUpperCase() + fieldName.slice(1);
      colName = colName.replace(/([a-z])([A-Z])/g, '$1 $2');
      return colName;
    }).filter((col) => col !== 'Action' && col !== 'Photo');
    console.log('columns: ', columns);
    
    let rowsData: any[] = [];
    await new Promise((resolve, reject) => {
      this.rowDefs.forEach(async (row: any) => {
        const imagePath = row && row.imagePath1 ? row.imagePath1 : row.imagePath2;
        let base64ImageData: any;
        if (imagePath) {
          const fullImagePath = environment.endpoint + `/${imagePath}`;
          base64ImageData = await this.getBase64ImageFromURL(fullImagePath);
        }
        const newRow = {
          customerId: row?.customerId,
          // photo: base64ImageData ?? '',
          fullName: row?.fullName,
          mobileNo: row?.mobileNo,
          emailId: row?.emailId,
          registrationDate: row?.registrationDate,
          isActive: row.isActive ? 'Active' : 'Inactive'
        }
        rowsData.push(newRow);
        if (rowsData.length === this.rowDefs.length) resolve(rowsData);
      });
    })
    return { header: columns, rows: rowsData };
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = (event: any) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        }
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url + "?not-from-cache-please";
    });
  }

  buildTableBody(columns: any, data: any) {
    var body: any = [];
    data.forEach((row: any) => {
      const dataRow: any = [];
      columns.forEach((col: any) => {
        let colTextCompressed = col.replace(/\s+/g, '').replace(/^\w/, (c: any) => c.toLowerCase());
        dataRow.push(row[colTextCompressed]);
      })
      body.push(dataRow);
    });
    return body;
  }

}

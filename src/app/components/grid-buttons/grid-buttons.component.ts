import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-buttons',
  templateUrl: './grid-buttons.component.html',
  styleUrls: ['./grid-buttons.component.scss'],
})
export class GridButtonsComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  label: string = '';

  ngOnInit() { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.label = this.params.label || null;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  onClick(src: number) {
    if (this.params.onClick instanceof Function) {
      const rowData = this.params?.node?.data;
      const gridId = this.params?.column?.colId;
      const props = { rowData, src, gridId };
      this.params.onClick(props);
    }
  }
}

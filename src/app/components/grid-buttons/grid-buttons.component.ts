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

  constructor() { }

  ngOnInit() { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.label = this.params.label || null;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  onClick(src: string) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        rowData: this.params.node.data,
        src
      }
      this.params.onClick(params);
    }
  }
}

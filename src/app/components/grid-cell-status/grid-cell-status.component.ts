import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-cell-status',
  templateUrl: './grid-cell-status.component.html',
  styleUrls: ['./grid-cell-status.component.scss'],
})
export class GridCellStatusComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  label: string = '';

  ngOnInit() { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.label = this.params?.data?.isActive || null;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

}

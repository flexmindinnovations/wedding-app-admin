import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-grid-cell-status',
  templateUrl: './grid-cell-status.component.html',
  styleUrls: ['./grid-cell-status.component.scss'],
})
export class GridCellStatusComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  label: string = '';

  isActive: any;
  id = uuidv4();
  ngOnInit() { }
  rowData: any;
  canEdit: any = true;
  fromCustomerPage:boolean=false;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    const refData = params?.data?.refData;
    if (refData) {
      this.fromCustomerPage = refData?.fromCustomerPage;
      const { canEdit, canDelete } = refData;
      this.canEdit = canEdit;
    }
    this.rowData = this.params?.data;
    this.label = this.rowData?.isActive || null;
    this.isActive = this.label;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  onItemChange(event: any) {
    const { customerId } = this.rowData;

  }

}

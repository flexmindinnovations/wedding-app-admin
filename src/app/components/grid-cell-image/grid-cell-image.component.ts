import { Component, Input, OnInit, inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grid-cell-image',
  templateUrl: './grid-cell-image.component.html',
  styleUrls: ['./grid-cell-image.component.scss'],
})
export class GridCellImageComponent implements OnInit, ICellRendererAngularComp {
  endpoint: string = environment.endpoint;
  params: any;
  src: string = '';

  ngOnInit() { }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    console.log(this.params);
    this.src = `${this.endpoint}/${this.params?.data?.branchImagePath}` || '';
    console.log(this.src);
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }
}

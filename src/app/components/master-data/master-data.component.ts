import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
})
export class MasterDataComponent implements OnInit {

  @Input() rowData: any = [];
  @Input() columnDefs: any = [];
  @Input('title') gridTitle: string = '';
  @Input('canAdd') canAddItem: boolean = false;
  @Output() gridAction: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  handleActionClick(event: any) {
    const props = {
      action: 'add',
      type: this.gridTitle
    };
    this.gridAction.emit(props);
  }

}

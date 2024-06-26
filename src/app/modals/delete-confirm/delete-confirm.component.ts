import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
})
export class DeleteConfirmComponent implements OnInit {

  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  messageBody: string = 'Are you sure you want to delete customer?  This action cannot be undone.';
  modalControllerService = inject(ModalController);

  constructor() { }

  ngOnInit(): void {
    console.log('data: ', this.data);
    this.messageBody = this.data?.data?.message;
    console.log('messageBody: ', this.messageBody);
    
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
    } else {
      this.modalControllerService.dismiss({ event: 'delete' });
    }
  }

}

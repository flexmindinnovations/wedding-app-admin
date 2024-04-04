import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
})
export class DeleteConfirmComponent {

  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
    } else {
      this.modalControllerService.dismiss({ event: 'delete' });
    }
  }

}

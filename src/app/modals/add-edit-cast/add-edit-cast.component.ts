import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-add-edit-cast',
  templateUrl: './add-edit-cast.component.html',
  styleUrls: ['./add-edit-cast.component.scss'],
})
export class AddEditCastComponent implements OnInit {
  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);
  alert = inject(AlertService);
  castId = 0;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.formGroup = this.fb.group({
      castName: ['', [Validators.required]],
      subCastName: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);
    })

  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  addNewCast() {
    let formVal = this.formGroup.value;
    // formVal = { heightId: 0, heightName: `${formVal.feet} feet ${formVal.inch} inch` }
    // this.accessHeightDataService.saveHeight(formVal).subscribe({
    //   next: (data: any) => {
    //     if (data) {
    //       this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
    //       this.modalControllerService.dismiss({ event: 'add' });
    //     }
    //   },
    //   error: (error) => {
    //     console.log('error: ', error);
    //     this.alert.setAlertMessage(error?.message, AlertType.error);
    //   }
    // })
  }

  updateCast() {
    let formVal = this.formGroup.value;
    // formVal = { heightId: this.heightId, heightName: `${formVal.feet} feet ${formVal.inch} inch` };
    // this.accessHeightDataService.updateHeight(formVal).subscribe({
    //   next: (data: any) => {
    //     if (data) {
    //       this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
    //       this.modalControllerService.dismiss({ event: 'update' });
    //     }
    //   },
    //   error: (error) => {
    //     console.log('error: ', error);
    //     this.alert.setAlertMessage(error?.message, AlertType.error);
    //   }
    // })
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }

    if (this.castId > 0) this.updateCast();
    else this.addNewCast();

  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }


}

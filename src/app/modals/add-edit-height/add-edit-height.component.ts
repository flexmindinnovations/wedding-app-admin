import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HeightService } from 'src/app/services/height/height.service';

@Component({
  selector: 'app-add-edit-height',
  templateUrl: './add-edit-height.component.html',
  styleUrls: ['./add-edit-height.component.scss'],
})
export class AddEditHeightComponent implements OnInit {
  @Input() data: any;
  formGroup: any;
  modalControllerService = inject(ModalController);
  accessHeightDataService = inject(HeightService);
  alert = inject(AlertService);
  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      feet: ['', [Validators.required]],
      inch: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);
    })
  }
  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
    } else {
      let formVal = this.formGroup.value;
      formVal = { heightId: 0, heightName: `${formVal.feet} feet ${formVal.inch} inch` }
      this.accessHeightDataService.saveHeight(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            this.modalControllerService.dismiss();
          }
        },
        error: (error) => {
          console.log('error: ', error);
          this.alert.setAlertMessage(error?.message, AlertType.error);
        }
      })

    }

  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

}

import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);
  accessUserDataService = inject(UserService);
  alert = inject(AlertService);
  userId = 0;
  roleList: any = [];
  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    console.log(data);
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.userId = modalData?.id;
    // this.formGroup.patchValue(props);
    console.log(this.formGroup.value)
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      roleId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^\d{3,15}$/)]],
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
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }

    if (this.userId > 0) this.updateUser();
    else this.addNewUser();

  }

  addNewUser() {
    let formVal = this.formGroup.value;
    formVal = { UserId: 0, }
    this.accessUserDataService.saveUser(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  updateUser() {
    let formVal = this.formGroup.value;
    formVal = { userId: this.userId, };
    this.accessUserDataService.updateUser(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'update' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

  onSelectionChange(event: any, src: any) {
    console.log(event, src)
  }

}
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.scss'],
})
export class RegisterCustomerComponent implements OnInit {

  @Input() data: any;
  formGroup: any;
  modalControllerService = inject(ModalController);
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  isDisabled: boolean = true;
  userNameList: any;
  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    this.userNameList = data?.userNameList;
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      mobileNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{3,15}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^.{3,15}$/)]],
    })
    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event;
      if (val.password === val.confirmPassword) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
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
    if (!this.formGroup.valid) return;
    this.registerCustomer();
  }

  registerCustomer() {
    let formVal = this.formGroup.value;
    let payload = {
      customerUserName: formVal.mobileNo,
      customerPassword: formVal.password
    };
    if (this.userNameList.includes(formVal.mobileNo)) {
      this.alert.setAlertMessage(`UserName Already exists`, AlertType.warning);
    }
    else {
      this.customerRegistrationService.signUpCustomer(payload).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            this.modalControllerService.dismiss({ event: 'add' });
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
          this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
        }
      })
    }
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

}


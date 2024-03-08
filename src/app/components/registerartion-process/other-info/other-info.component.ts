import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { findInvalidControlsRecursive } from 'src/util/util';

@Component({
  selector: 'other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit, AfterViewInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  otherData: any;
  @Output() otherInfoData = new EventEmitter();

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.otherData = this.customerData['otherInfoModel'];
    this.isEditMode = this.otherData?.otherInfoId > 0 ? true : false;
    if (this.isEditMode) this.patchFormData();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      expectations: ['', [Validators.required]],
      extraInformation: ['', [Validators.required]]
    })

    this.patchFormData();
  }

  patchFormData() {
    this.formGroup.patchValue({
      expectations: 'Test',
      extraInformation: 'Test',
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnPrevious(src: string) {
    const formVal = this.formGroup.value;
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 4,
      action: ActionValue.previous,
      isCompleted: false
    }
    this.otherInfoData.emit(props);
  }

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId, otherInfoId: 0 };
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, otherInfoId: 0 };
    this.customerRegistrationService.saveContactInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, otherInfoId: data?.id },
            formId: 4,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'photos',
              data: {},
              formId: 5,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.otherInfoData.emit(props);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const otherInfo = this.customerData['otherInfoModel'];
    console.log('customerData: ', this.customerData);
    const payload = { ...formVal, otherInfoId: otherInfo.otherInfoId };
    this.customerRegistrationService.updateOtherInformation(payload, this.customerData?.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, otherInfoId: data?.id },
            formId: 4,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'photos',
              data: {},
              formId: 5,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.otherInfoData.emit(props);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
    })
  }


}

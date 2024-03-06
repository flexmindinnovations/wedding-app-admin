import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { findInvalidControlsRecursive } from 'src/util/util';

@Component({
  selector: 'family-info',
  templateUrl: './family-info.component.html',
  styleUrls: ['./family-info.component.scss'],
})
export class FamilyInfoComponent implements OnInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  @Input() isEditMode: boolean = false;
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);

  @Output() familyInfoData = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      fatherName: ['', [Validators.required]],
      fatherOccupation: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      motherOccupation: ['', [Validators.required]],
      noOfBrothers: ['', [Validators.required]],
      noOfMarriedBrothers: ['', [Validators.required]],
      noOfSisters: ['', [Validators.required]],
      noOfMarriedSisters: ['', [Validators.required]]
    })
    this.patchFormData();
  }

  patchFormData() {
    this.formGroup.patchValue({
      fatherName: 'Abdul Karim',
      fatherOccupation: 'Self Employeed',
      motherName: 'Jahan',
      motherOccupation: 'House Wife',
      noOfBrothers: 2,
      noOfMarriedBrothers: 1,
      noOfSisters: 1,
      noOfMarriedSisters: 1
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnPrevious(src: string) {
    const formVal = this.formGroup.value;
    // if (this.formGroup.valid) {
    //   this.customerRegistrationService.saveFamilyInformation(formVal).subscribe({
    //     next: (data: any) => {
    //       if (data) {
    //         this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 2,
      action: ActionValue.previous,
      isCompleted: this.formGroup.valid
    }
    this.familyInfoData.emit(props);
    //       }
    //     },
    //     error: (error: any) => {
    //       console.log('error: ', error);
    //       this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
    //     }
    //   })
    // } else {
    //   const invalidFields = findInvalidControlsRecursive(this.formGroup);
    //   console.log('invalidFields: ', invalidFields);
    //   invalidFields.forEach((item: any) => {
    //     this.alert.setAlertMessage(item, AlertType.error);
    //   })
    // }
  }

  handleClickOnNext(src: string) {
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId, familyInfoId: 0 };
    if (this.formGroup.valid) {
      this.customerRegistrationService.saveFamilyInformation(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            const props: FormStep = {
              source: src,
              data: { ...formVal, familyInfoId: data?.id },
              formId: 2,
              action: ActionValue.next,
              isCompleted: true,
              previous: {
                source: 'personal',
                data: {},
                formId: 1,
                action: ActionValue.previous,
                isCompleted: true
              },
              next: {
                source: 'contact',
                data: {},
                formId: 3,
                action: ActionValue.next,
                isCompleted: false
              }
            }
            this.familyInfoData.emit(props);
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
          this.alert.setAlertMessage('Family Info: ' + error?.statusText, AlertType.error);
        }
      })
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }


}

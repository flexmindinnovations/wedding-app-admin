import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.page.html',
  styleUrls: ['./add-edit-customer.page.scss'],
})
export class AddEditCustomerPage implements OnInit, OnDestroy {
  personalDetailsFormGroup!: FormGroup;
  contactDetailsFormGroup !: FormGroup;
  completedStep!: FormStep;
  currentForm: number = 1;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.personalDetailsFormGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      surName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      height: ['', [Validators.required]],
      education: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      physicalStatus: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]]
    })

    this.personalDetailsFormGroup.valueChanges.subscribe((event) => {
      const val = event
      console.log('val: ', val);

    })
  }

  get personalFormControl(): { [key: string]: FormControl } {
    return this.personalDetailsFormGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(data: FormStep) {
    this.completedStep = data;
    if (data.action === ActionValue.next) {
      if (this.completedStep.formId === 5) {
        this.currentForm = this.completedStep.formId;
        return;
      } else {
        this.currentForm = this.completedStep.formId + 1;
      }
    } else {
      console.log('data: ', data);
      if (data.formId === 1) {
        this.currentForm = this.completedStep.formId;
        return;
      } else {
        this.currentForm = this.completedStep.formId - 1;
      }
    }
  }

  ngOnDestroy(): void { }

}

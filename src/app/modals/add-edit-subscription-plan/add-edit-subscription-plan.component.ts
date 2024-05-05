import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-add-edit-subscription-plan',
  templateUrl: './add-edit-subscription-plan.component.html',
  styleUrls: ['./add-edit-subscription-plan.component.scss'],
})
export class AddEditSubscriptionPlanComponent implements OnInit {

  formGroup!: FormGroup;

  @Input() data: any;

  subscriptionPlanId = 0;

  isEditMode: boolean = false;
  isActive: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      planName: ['', [Validators.required]],
      originalAmount: ['', [Validators.required]],
      discountAmount: ['', [Validators.required]],
      actualAmount: ['', [Validators.required]],
      planStartDate: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
    });
    this.formGroup.get('isActive')?.setValue(true);
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleButtonClick(event: any) {
    const isCancel = event?.isCancel;
    if (!isCancel) {
      if (this.formGroup.invalid) {
        this.alertService.setAlertMessage('One or more form fields are invalid, please provide valid data', AlertType.error);
        return;
      }
      if (this.subscriptionPlanId > 0) this.updateSubscriptionPlan();
      else this.saveSubscriptionPlan();
    } else {
      this.modalController.dismiss({ event: 'cancel' });
      return;
    }
  }

  saveSubscriptionPlan() {
    const formValue = this.formGroup.value;
    console.log('formValue: ', formValue);
  }

  updateSubscriptionPlan() {
    const formValue = this.formGroup.value;
    console.log('formValue: ', formValue);
  }

}

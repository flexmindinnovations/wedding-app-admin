import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { SubscriptionPlanService } from 'src/app/services/subscription-plan/subscription-plan.service';

@Component({
  selector: 'app-add-edit-subscription-plan',
  templateUrl: './add-edit-subscription-plan.component.html',
  styleUrls: ['./add-edit-subscription-plan.component.scss'],
})
export class AddEditSubscriptionPlanComponent implements OnInit {

  formGroup!: FormGroup;

  @Input() data: any;

  subscriptionPlanId = 0;
  cdref = inject(ChangeDetectorRef);
  isEditMode: boolean = false;
  isActive: boolean = false;
  isLoading: boolean = false;
  subscriptionPlanService = inject(SubscriptionPlanService)

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.subscriptionPlanId = modalData?.planId;
    const props = {
      ...modalData,
      planStartDate: new Date(modalData?.planStartDate),
    }
    this.formGroup.patchValue(modalData);
    this.cdref.detectChanges();
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
    const planStartDate = new Date(formValue['planStartDate']);
    const payload = { ...formValue, planId: this.subscriptionPlanId, planStartDate }
    this.subscriptionPlanService.saveNewSubscriptionPlan(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalController.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  updateSubscriptionPlan() {
    const formValue = this.formGroup.value;
    const planStartDate = moment(formValue['planStartDate']).add(1, 'days');
    const payload = { ...formValue, planId: this.subscriptionPlanId, planStartDate }
    this.subscriptionPlanService.updateSubscriptionPlan(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalController.dismiss({ event: 'update' });
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

}

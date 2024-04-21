import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { StepperFormItem } from 'src/app/interfaces/stepper-form';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { FormStepperService } from 'src/app/services/form-stepper.service';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.page.html',
  styleUrls: ['./add-edit-customer.page.scss'],
})
export class AddEditCustomerPage implements OnInit, AfterViewInit, OnDestroy {

  stepperItems: StepperFormItem[] = [];
  active: number = 0;
  formStepperService = inject(FormStepperService);


  personalDetailsFormGroup!: FormGroup;
  contactDetailsFormGroup !: FormGroup;
  completedStep!: FormStep;
  currentForm: number = 1;
  isEditMode: boolean = false;
  customerId = 0;
  customerDetails: any = null;
  isDataLoaded = false;

  router = inject(Router);
  customerService = inject(CustomerRegistrationService);
  fb = inject(FormBuilder);
  activeRouter = inject(ActivatedRoute);
  alertService = inject(AlertService);

  ngOnInit() {
    this.initFormGroup();
    this.getFormStepperItems();
  }

  getFormStepperItems() {
    this.formStepperService.getFormStepperItems().subscribe((items: StepperFormItem[]) => {
      this.stepperItems = items.map((item: StepperFormItem) => {
        if (item.id === 1) {
          item.isActive = true;
        }
        return item;
      });
    })
  }
  ngAfterViewInit(): void {
    this.activeRouter.params.subscribe((params: any) => {
      this.customerId = params && params['id'] ? params['id'] : 0;
      if (this.customerId > 0) this.getCustomerDetails();
      else this.isDataLoaded = true;
    })
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
  }

  get personalFormControl(): { [key: string]: FormControl } {
    return this.personalDetailsFormGroup.controls as { [key: string]: FormControl };
  }

  getCustomerDetails(): void {
    this.customerService.getCustomerDetailsById(this.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerDetails = data;
          this.isDataLoaded = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  handleClickOnNext(data: FormStep) {
    // debugger;
    this.completedStep = data;
    if (data.action === ActionValue.next) {
      if (this.completedStep.formId === 5) {
        this.currentForm = this.completedStep.formId;
        return;
      } else {
        this.currentForm = this.completedStep.formId + 1;
      }
    } else {
      // console.log('data: ', data);
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

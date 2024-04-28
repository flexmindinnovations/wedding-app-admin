import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
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
  cdref = inject(ChangeDetectorRef);
  motherTongueListOptions: any = [];
  motherTongueId: any = ''
  sharedService = inject(SharedService);
  activeRouter = inject(ActivatedRoute);
  customerService = inject(CustomerRegistrationService);
  customerId = 0;
  isDataLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getMotherTongueList();
  }

  ngAfterViewInit(): void {
    this.activeRouter.params.subscribe((params: any) => {
      this.customerId = history.state.customerId ? history.state.customerId : 0;
      if (this.customerId > 0) this.getCustomerDetails();
      else this.isDataLoaded = true;
    })
    this.cdref.detectChanges();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      expectations: ['', [Validators.required]],
      extraInformation: ['', [Validators.required]],
      motherTongueId: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((value: any) => { })
  }

  patchFormData() {
    this.formGroup.patchValue(this.otherData);
    this.cdref.detectChanges();
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

  onSelectionChange(event: any, src: string) {
    if (src) {
      const motherTongueId = event?.motherTongueId;
      this.motherTongueId = motherTongueId;
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, otherInfoId: 0 };
    this.customerRegistrationService.saveOtherInformation(payload).subscribe({
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
          this.router.navigateByUrl(`customers/add/photos`);
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const otherInfo = this.customerData['otherInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, otherInfoId: otherInfo.otherInfoId };
    this.customerRegistrationService.updateOtherInformation(payload, customerId).subscribe({
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
          this.router.navigateByUrl(`customers/edit/${customerId}/photos`,{ state: { route: 'edit', pageName: 'Edit Customer', title: 'Edit Customer', customerId: this.customerId } });
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }
  getMotherTongueList() {
    this.sharedService.getMotherTongueList().subscribe({
      next: (data: any) => {
        if (data) {
          this.motherTongueListOptions = data?.map((item: any) => {
            return {
              id: item?.motherTongueId,
              title: item?.motherTongueName,
            }
          });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  getCustomerDetails(): void {
    this.customerService.getCustomerDetailsById(this.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerData = data;
          this.otherData = JSON.parse(JSON.stringify(this.customerData['otherInfoModel']));
          this.isEditMode = this.customerData ? this.customerData['isOtherInfoFill'] : false;
          if (this.isEditMode) this.patchFormData();
          this.cdref.detectChanges();
          this.isDataLoaded = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

}

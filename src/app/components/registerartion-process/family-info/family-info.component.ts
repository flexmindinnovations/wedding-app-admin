import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { error } from 'console';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';
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
  isEditMode: boolean = false;
  familyData: any;
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  castService = inject(CastService);

  @Output() familyInfoData = new EventEmitter();
  cdref = inject(ChangeDetectorRef);

  castListOptions: any[] = [];
  subCastListOptions: any[] = [];

  hasSubCast: boolean = false;
  subCastId: boolean = false;

  isSubCastDataAvailable: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCastList();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.familyData = this.customerData['familyInfoModel'];
  }

  ngAfterViewInit(): void {
    if (this.familyData) {
      this.isEditMode = this.familyData?.familyInfoId > 0 ? true : false;
      if (this.isEditMode) this.patchFormData();
    }
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
      noOfMarriedSisters: ['', [Validators.required]],
      castId: ['', [Validators.required]],
      subCastId: ['', [Validators.required]]
    })
  }

  patchFormData() {
    this.formGroup.patchValue(this.familyData);
    this.cdref.detectChanges();
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
    const formVal = { ...this.formGroup.value, customerId: this.completedStep?.data?.customerId };
    this.cdref.detectChanges();
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
    const payload = { ...formVal, familyInfoId: 0 };
    this.customerRegistrationService.saveFamilyInformation(payload).subscribe({
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
  }

  updateCustomerInfo(formVal: any, src: string): void {
    const payload = { ...formVal, familyInfoId: this.familyData.familyInfoId };
    this.customerRegistrationService.updateFamilyInformation(payload, this.customerData?.customerId).subscribe({
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
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'castId':
        this.hasSubCast = event?.hasSubcast;
        if (this.hasSubCast) this.getSubCastList(event?.id);
        break;
      case 'subCastId':
        const subCastId = event?.subCastId;
        this.subCastId = subCastId;
        break;
    }
  }

  getCastList() {
    this.castService.getCastList().subscribe({
      next: (response: any) => {
        if(response) {
          this.castListOptions = response.map((item: any) => {
            return {
              id: item?.castId,
              title: item?.castName,
              hasSubcast: item?.hasSubcast
            }
          })
        }
      },
      error: (error) => { }
    })
  }

  getSubCastList(castId: number) {
    this.subCastListOptions = [];
    this.isSubCastDataAvailable = false;
    this.castService.getSubCastListByCast(castId).subscribe({
      next: (response: any) => {
        if(response) {
          this.subCastListOptions = response.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName
            }
          })
          this.isSubCastDataAvailable = true;
        }
      },
      error: (error) => { }
    })
  }


}

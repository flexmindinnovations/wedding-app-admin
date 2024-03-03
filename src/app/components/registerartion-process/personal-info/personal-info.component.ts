import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EducationService } from 'src/app/services/education/education.service';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {

  formGroup!: FormGroup;
  genderOptions: any = [];
  maritalStatusOptions: any = [];
  educationListOptions: any = [];
  specializationListOptions: any = [];
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() personalInfoData = new EventEmitter();
  educationService = inject(EducationService);
  alert = inject(AlertService);

  hasSpecialization: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getMasterData();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'female' },
    ];

    this.maritalStatusOptions = [
      { id: 'married', title: 'Married' },
      { id: 'unmarried', title: 'Unmarried' }
    ]
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      surName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      height: ['', [Validators.required]],
      education: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      physicalStatus: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]]
    });
    this.patchValue();
  }

  patchValue() {
    this.formGroup.patchValue(
      {
        firstName: 'Mohammed',
        lastName: 'Ali',
        surName: 'Mohammed',
        gender: '',
        height: '',
        education: '',
        specialization: '',
        dateOfBirth: '',
        occupation: 'Self Employed',
        physicalStatus: '',
        maritalStatus: '',
        hobbies: 'Test'
      }
    )
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    console.log('formVal: ', formVal);

    // if (this.formGroup.valid) {
    // const props: FormStep = {
    //   source: src,
    //   data: formVal,
    //   formId: 1,
    //   action: ActionValue.next,
    //   isCompleted: true
    // }
    // this.personalInfoData.emit(props);
    // }
  }

  getMasterData() {
    const education = this.educationService.getEducationList();
    forkJoin({ education })
      .subscribe({
        next: async (result) => {
          // console.log('result: ', result);
          const { education } = result;
          this.educationListOptions = education.map((item: any) => {
            return {
              id: item?.educationId,
              title: item?.educationName,
              hasSpecialization: item?.hasSpecialization
            }
          });
        },
        error: (error: Error) => {
          console.log('error: ', error);
          this.alert.setAlertMessage('Error while processing request', AlertType.error);
        }
      })
  }

  onSelectionChange(event: any, src: string) {
    console.log('event: ', { event: event?.hasSpecialization, src });
    switch (src) {
      case 'education':
        this.hasSpecialization = event?.hasSpecialization;
        if (this.hasSpecialization) this.getSpecialization(event?.id);
        break;

    }
  }

  getSpecialization(educationId: number) {
    this.educationService.getSpecializationListByEducationId(educationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.specializationListOptions = data.map((item: any) => {
            console.log('item: ', item);

            return {
              id: item?.educationId,
              title: item?.specializationName,
              educationId,
              specializationId: item?.specializationId
            }
          });
          console.log('specializationListOptions: ', this.specializationListOptions);

        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

}

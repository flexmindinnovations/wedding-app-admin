import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';

@Component({
  selector: 'photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() photosData = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
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

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);

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
      formId: 5,
      action: ActionValue.previous,
      isCompleted: this.formGroup.valid
    }
    this.photosData.emit(props);
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    // if (this.formGroup.valid) {
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 5,
      action: ActionValue.next,
      isCompleted: true
    }
    this.photosData.emit(props);
    // }
  }

}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';

@Component({
  selector: 'contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() contactInfoData = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      contactOf: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      whatsAppNumber: ['', [Validators.required]],
      homeAddress: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
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
      formId: 3,
      action: ActionValue.previous,
      // isCompleted: this.formGroup.valid
      isCompleted: true
    }
    this.contactInfoData.emit(props);
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    // if (this.formGroup.valid) {
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 3,
      action: ActionValue.next,
      isCompleted: true
    }
    this.contactInfoData.emit(props);
    // }
  }

}

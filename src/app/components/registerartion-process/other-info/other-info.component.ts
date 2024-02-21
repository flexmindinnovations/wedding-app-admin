import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';

@Component({
  selector: 'other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit {
  
  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;

  @Output() otherInfoData = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      expectations: ['', [Validators.required]],
      extraInformation: ['', [Validators.required]]
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
      formId: 4,
      action: ActionValue.previous,
      isCompleted: false
    }
    this.otherInfoData.emit(props);
  }

  handleClickOnNext(src: string) {
    const formVal = this.formGroup.value;
    // if (this.formGroup.valid) {
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 4,
      action: ActionValue.next,
      // isCompleted: this.formGroup.valid
      isCompleted: true
    }
    this.otherInfoData.emit(props);
    // }
  }


}

import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';

@Component({
  selector: 'photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit, AfterViewInit {
  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  imagesData: any;
  @Output() photosData = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    console.log('customerData: ', this.customerData);
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
      isCompleted: true,
      previous: {
        source: 'other',
        data: {},
        formId: 4,
        action: ActionValue.previous,
        isCompleted: true
      },
      next: null
    }
    this.photosData.emit(props);
    // }
  }

}

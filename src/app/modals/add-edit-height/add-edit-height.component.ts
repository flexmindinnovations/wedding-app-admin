import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-add-edit-height',
  templateUrl: './add-edit-height.component.html',
  styleUrls: ['./add-edit-height.component.scss'],
})
export class AddEditHeightComponent implements OnInit {

  formGroup: any;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      feet: ['', [Validators.required]],
      inch: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);

    })
  }
  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

}

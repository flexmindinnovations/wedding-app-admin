import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.page.html',
  styleUrls: ['./add-edit-user.page.scss'],
})
export class AddEditUserPage implements OnInit {
  personalDetailsFormGroup!: FormGroup;
  contactDetailsFormGroup !: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
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

    this.personalDetailsFormGroup.valueChanges.subscribe((event) => {
      const val = event
      console.log('val: ', val);

    })
  }

  get personalFormControl(): { [key: string]: FormControl } {
    return this.personalDetailsFormGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

}

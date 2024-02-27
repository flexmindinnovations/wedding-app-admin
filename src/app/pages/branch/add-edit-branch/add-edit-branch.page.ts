import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.page.html',
  styleUrls: ['./add-edit-branch.page.scss'],
})
export class AddEditBranchPage implements OnInit {
  sharedService = inject(SharedService)
  formGroup: any;
  countryList: any;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCountryList();
    this.getCityByState();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      order: ['', [Validators.required]],
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

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any[]) => {
        console.log('data : ', data);

        this.countryList = data.map((item: any) => {
          const obj = {
            countryId: item?.countryId,
            title: item?.countryName
          }
          return obj;
        });
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }
  getCityByState() {
    this.sharedService.getCityByState().subscribe({
      next: (data: any[]) => {
        console.log(data)

      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

}

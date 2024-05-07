import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-branch',
  templateUrl: './add-edit-branch.component.html',
  styleUrls: ['./add-edit-branch.component.scss'],
})
export class AddEditBranchComponent  implements OnInit {
  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);
  sharedService = inject(SharedService);
  branchService = inject(BranchService);
  router = inject(Router);
  alert = inject(AlertService);
  countryList: any;
  stateList: any;
  cityList: any;
  isActive: boolean = true;
  cssClass: any;
  selectedImage: any[] = [];
  branchId: number = 0;
  countryId = undefined;
  stateId = undefined;
  cityId = undefined;
  imagePath: string = '';
  imageName: string = '';
  branchDetails: any = null;
  isDataLoaded = false;
  alreadyBranchList:any;
  cdref = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCountryList();
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    this.alreadyBranchList = data?.alreadyBranchList; 
  }

  ngAfterViewInit(): void {
    const modalData = this.data?.data?.rowData;
    this.branchId = modalData?.id;
    if (this.branchId > 0) this.getBranchDetails();
  }

  getBranchDetails() {
         const modalData = this.data?.data?.rowData;
          this.branchDetails = modalData;
          this.imagePath = environment.endpoint + '/' + modalData?.branchImagePath;
          const imageNameIndex = modalData?.branchImagePath.lastIndexOf('/') + 1;
          this.imageName = modalData?.branchImagePath.substring(imageNameIndex, modalData?.branchImagePath.length);
          this.isActive = modalData?.isActive;
          this.formGroup.patchValue(modalData);
          if(this.imagePath){
            this.selectedImage.push(this.imagePath);
          }
          this.cdref.detectChanges();
          this.isDataLoaded = true;
  }

  
  initFormGroup() {
    this.formGroup = this.fb.group({
      isActive: !['', Validators.required],
      branchName: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      // order: ['', [Validators.required]],
    })
  }
  
  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSelectedImage(event: any) {
    this.selectedImage.push(event?.file);
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'countryId':
        this.stateList = [];
        this.cityList = [];
        this.getStateByCountry(event?.id);
        break;
      case 'stateId':
        this.cityList = [];
        this.getCityByState(event?.id);
        break;
    }
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }
    if (this.branchId > 0) this.updateBranch();
    else this.saveBranch();

  }

  saveBranch() {
    let formVal = this.formGroup.value;
    formVal = { ...formVal, isActive: this.isActive, branchImagePath: '' }
    const formData: FormData = new FormData();
    formData.append('branchModel', JSON.stringify(formVal));
    if (this.selectedImage) formData.append('file', this.selectedImage[0], this.selectedImage[0].name);
    this.branchService.addBranch(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        const err = error?.error;
        console.log('err: ', err);

        this.alert.setAlertMessage(err?.title, AlertType.error);
      }
    })
  }

  updateBranch() {
    const branchId = this.branchDetails['branchId'];
    let formVal = this.formGroup.value;
    formVal = { ...formVal, branchId, isActive: this.isActive, branchImagePath: this.branchDetails['branchImagePath'] }
    const formData: FormData = new FormData();
    formData.append('branchModel', JSON.stringify(formVal));
    // if (this.selectedImage) formData.append('file', this.selectedImage[0], this.selectedImage[0].name);
    this.branchService.updateBranch(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'update' });
        }
      },
      error: (error) => {
        const err = error?.error;
        console.log('err: ', err);

        this.alert.setAlertMessage(err?.title, AlertType.error);
      }
    })
  }

  toggleActive() {
    this.isActive = !this.isActive;
    this.formGroup.patchValue({ isActive: this.isActive });
  }

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any) => {
        this.countryList = data?.map((item: any) => {
          const obj = {
            id: item?.countryId,
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
  getStateByCountry(countryId: number) {
    if (countryId) {
      this.sharedService.getStatByCountry(countryId).subscribe({
        next: (data: any[]) => {
          this.stateList = data?.map((item: any) => {
            const obj = {
              id: item?.stateId,
              title: item?.stateName
            }
            return obj;
          });
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }

  }
  getCityByState(stateId: number) {
    if (stateId) {
      this.sharedService.getCityByState(stateId).subscribe({
        next: (data: any[]) => {
          this.cityList = data?.map((item: any) => {
            const obj = {
              id: item?.cityId,
              title: item?.cityName
            }
            return obj;
          });

        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }
  }

}

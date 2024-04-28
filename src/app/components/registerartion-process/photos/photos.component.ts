import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() completedStep!: FormStep;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  imagesData: any;
  @Output() photosData = new EventEmitter();
  customerRegistrationService = inject(CustomerRegistrationService);
  alert = inject(AlertService);
  cdref = inject(ChangeDetectorRef);
  sharedService = inject(SharedService);
  selectedFiles: any[] = [];
  // photoNext: boolean = false;
  thumbnailImage = '';
  photo1 = '';
  imageName: string = '';
  photoName: string = '';
  router = inject(Router);
  imageData: any[] = [];
  activeRouter = inject(ActivatedRoute);
  customerService = inject(CustomerRegistrationService);
  customerId = 0;
  isDataLoaded: boolean = false;

  constructor(
    private activedRoute: ActivatedRoute
  ) { }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.imagesData = this.customerData?.photos;
  }

  ngOnInit() {
    this.activedRoute.params.subscribe((params) => {
      const urlPath = window.location.pathname;
      const splittedUrl = urlPath.split('/');
      const extractCustomerId = Number(splittedUrl[splittedUrl.length - 2]);
      if (extractCustomerId && typeof extractCustomerId === 'number') {
        this.getCustomerDetails(extractCustomerId);
      }
    })
  }

  ngAfterViewInit(): void { }

  getCustomerDetails(customerId: any) {
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (response) => {
        if (response) {
          this.customerData = response;
          const isOtherInfoFill = response?.isOtherInfoFill;
          if (isOtherInfoFill) {
            this.isEditMode = response?.isImagesAdded;
            this.photosData = response?.imageInfoModel;
            if (this.isEditMode) this.getCustomerImages();
            this.setStepperData();
          } else {
            this.router.navigateByUrl(`customers/edit/${customerId}/other`);
          }
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Something went wrong', AlertType.error);
      }
    })
  }

  setStepperData() {
    const props: FormStep = {
      source: 'photos',
      data: [],
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
    this.sharedService.stepData.next(props);
  }

  getCustomerImages() {
    const imageInfoModel = this.customerData['imageInfoModel'];
    this.thumbnailImage = `${environment.endpoint}/${imageInfoModel?.imagePath1}`;
    const imageNameIndex = imageInfoModel?.imagePath1?.lastIndexOf('/') + 1;
    this.imageName = imageInfoModel?.imagePath1?.substring(imageNameIndex, imageInfoModel?.imagePath1.length);
    this.photo1 = `${environment.endpoint}/${imageInfoModel?.imagePath2}`;
    const photo1NameIndex = imageInfoModel?.imagePath2?.lastIndexOf('/') + 1;
    this.photoName = imageInfoModel?.imagePath2?.substring(photo1NameIndex, imageInfoModel?.imagePath2.length);
    if (this.thumbnailImage && this.photo1) {
      this.imageData.push(this.thumbnailImage);
      this.imageData.push(this.photo1);
    }
    // if (this.selectedFiles.length === 2 || this.imageData.length === 2) {
    //   this.photoNext = true;
    // }
    // console.log('photos', this.imageName, this.photoName);
    if (this.imageData.length === 2) this.sharedService.imagesSelected.next(true);
    this.cdref.detectChanges();
  }

  handleSelectedImage(event: any, src: string) {
    // console.log(event, src)
    switch (src) {
      case 'thumbnail':
        this.selectedFiles.push(event.file);
        break;
      case 'photo':
        this.selectedFiles.push(event.file);
        break;
    }

    if (this.selectedFiles.length === 2) this.sharedService.imagesSelected.next(true);
    this.cdref.detectChanges();
    // console.log(this.selectedFiles)
  }

  handleClickOnPrevious(src: string) {
    const props: FormStep = {
      source: src,
      data: [],
      formId: 5,
      action: ActionValue.previous,
      isCompleted: false
    }
    this.photosData.emit(props);
  }

  handleClickOnNext(src: string) {
    this.cdref.detectChanges();
    if (this.isEditMode) this.updateCustomerInfo(src);
    else this.saveNewCustomerInfo(src);
  }


  saveNewCustomerInfo(src: string): void {
    const customerId: any = this.completedStep?.data?.customerId;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    // console.log(this.selectedFiles);
    this.selectedFiles.forEach((file: any) => {
      formData.append('file', file, file.name);
    })
    this.customerRegistrationService.savePhotos(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: [],
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
          this.router.navigateByUrl('customers');
          this.customerRegistrationService.setRequestStatus(true, 'add');
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(src: string): void {
    const customerId = this.customerData?.customerId;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    // console.log(this.selectedFiles);
    this.selectedFiles.forEach((file: any) => {
      formData.append('file', file, file.name);
    })
    this.customerRegistrationService.updatePhotos(formData, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: [],
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
          this.router.navigateByUrl('customers');
          this.customerRegistrationService.setRequestStatus(true, 'update');
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }
}

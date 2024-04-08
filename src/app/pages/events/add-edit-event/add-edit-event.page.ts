import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { COLOR_SCHEME, findInvalidControlsRecursive, themeVariables } from 'src/util/util';
import * as moment from 'moment';
import { EventService } from 'src/app/services/event/event.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-event',
  templateUrl: './add-edit-event.page.html',
  styleUrls: ['./add-edit-event.page.scss'],
})
export class AddEditEventPage implements OnInit, AfterViewInit {
  formGroup!: FormGroup;
  fb = inject(FormBuilder)
  isActive: boolean = true;
  colorScheme: any = COLOR_SCHEME;
  selectedImage: any = null;
  cssClass: any;
  eventService = inject(EventService);
  alert = inject(AlertService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  eventId: number = 0;
  isDataLoaded: boolean = false;
  imagePath: string = '';
  imageName: string = '';
  eventDetails: any;
  quillConfiguration = {
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],
    //   ['blockquote', 'code-block'],
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //   [{ color: [] }, { background: [] }],
    //   ['link'],
    //   ['clean'],
    // ],
  }

  ngOnInit() {
    this.initFormGroup();
    this.setCurrentClass();
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.eventId = params && params['eventId'] ? params['eventId'] : 0;
      if (this.eventId > 0) this.getEventDetails();
      else this.isDataLoaded = true;
    })
    this.eventService.getRequestStatus().subscribe(isCompleted => {
      if (isCompleted) this.getEventDetails();
    })
  }

  getEventDetails() {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data: any) => {
        if (data) {
          this.eventDetails = data;
          this.imagePath = environment.endpoint + '/' + data?.eventImagePath;
          const imageNameIndex = data?.eventImagePath.lastIndexOf('/') + 1;
          this.imageName = data?.eventImagePath.substring(imageNameIndex, data?.eventImagePath.length);
          this.isActive = data?.isActive;
          data['eventDate'] = new Date(data['eventDate']);
          this.formGroup.patchValue(data);
          this.isDataLoaded = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleSelectedImage(event: any) {
    this.selectedImage = event?.file;
  }

  setCurrentClass() {
    this.colorScheme = localStorage.getItem('color-scheme') || this.colorScheme;
    this.cssClass = themeVariables[this.colorScheme];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      eventName: ['', [Validators.required]],
      eventDescription: !['', Validators.required],
      location: ['', [Validators.required]],
      eventDate: !['', [Validators.required]],
      isActive: !['', [Validators.required]]
    })

  }

  toggleActive() {
    this.isActive = !this.isActive;
    this.formGroup.patchValue({ isActive: this.isActive });

  }

  handleInputChange(event: any) {
    this.formGroup.patchValue({ eventDate: event });
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  handleFormSubmit() {
    if (this.formGroup.invalid) {
      const invalidControls = findInvalidControlsRecursive(this.formGroup);
      return;
    }
    if (this.eventId === 0) this.saveNewEvent();
    else this.updateEvent();
  }

  saveNewEvent() {
    const userId = localStorage.getItem('userId');
    let eventDate = this.formGroup.get('eventDate')?.value;
    eventDate = eventDate ? moment(eventDate).format() : moment().format()
    const formVal = { ...this.formGroup.value, eventImagePath: '', isActive: this.isActive, eventDate, createdBy: Number(userId) };
    const formData = new FormData();
    formData.append('eventModel', JSON.stringify(formVal));
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }
    this.eventService.addNewEvent(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl('events');
          this.eventService.setRequestStatus(true, 'add');
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    });
  }

  updateEvent() {
    const userId = localStorage.getItem('userId');
    const eventId = this.eventDetails['eventId'];
    const formVal = this.formGroup.value;
    const payload = { ...formVal, eventId, eventImagePath: this.eventDetails['eventImagePath'], eventDate: moment(formVal?.eventDate).format(), createdBy: Number(userId) }
    const formData = new FormData();
    formData.append('eventModel', JSON.stringify(payload));
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }
    this.eventService.updateEvent(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl('events');
          this.eventService.setRequestStatus(true, 'upadate');
        }
      },
      error: (error) => {
        const err = error?.error;
        console.log('err: ', err);
        this.alert.setAlertMessage(err?.title, AlertType.error);
      }
    });
  }

}

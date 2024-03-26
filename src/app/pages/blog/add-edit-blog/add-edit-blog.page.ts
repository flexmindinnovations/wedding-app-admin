import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { QuillConfig } from 'ngx-quill';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { BlogService } from 'src/app/services/blog/blog.service';
import { environment } from 'src/environments/environment';
import { COLOR_SCHEME, findInvalidControlsRecursive, themeVariables } from 'src/util/util';

@Component({
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.page.html',
  styleUrls: ['./add-edit-blog.page.scss'],
})
export class AddEditBlogPage implements OnInit, AfterViewInit {

  formGroup!: FormGroup;
  isActive: boolean = true;
  isEditMode: boolean = false;
  blogId: number = 0;
  blogDetails: any = null;
  isDataLoaded = false;
  router = inject(Router);
  fb = inject(FormBuilder)
  activeRouter = inject(ActivatedRoute);
  alertService = inject(AlertService);
  blogService = inject(BlogService);
  colorScheme: any = COLOR_SCHEME;
  cssClass: any;
  imagePath: string = '';
  imageName: string = '';
  selectedImage: any = null;

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

  constructor() { }

  ngOnInit() {
    this.initFormGroup();
    this.setCurrentClass();
  }


  ngAfterViewInit(): void {
    this.activeRouter.params.subscribe((params: any) => {
      this.blogId = params && params['id'] ? params['id'] : 0;
      if (this.blogId > 0) this.getBlogDetails();
      else this.isDataLoaded = true;
    })
  }

  handleSelectedImage(event: any) {
    console.log(event);
    this.selectedImage = event.file;
    console.log('selectedImage: ', this.selectedImage);

  }

  getBlogDetails() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.blogDetails = data;
          this.imagePath = environment.endpoint + '/' + data?.blogImagePath;
          const imageNameIndex = data?.blogImagePath.lastIndexOf('/') + 1;
          this.imageName = data?.blogImagePath.substring(imageNameIndex, data?.blogImagePath.length);
          this.isActive = data?.isActive;
          data['blogDate'] = new Date(data['blogDate']);
          this.formGroup.patchValue(data);
          this.isDataLoaded = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }


  setCurrentClass() {
    this.colorScheme = localStorage.getItem('color-scheme') || this.colorScheme;
    this.cssClass = themeVariables[this.colorScheme];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      blogTitle: ['', [Validators.required]],
      blogText: !['', Validators.required],
      blogDate: ['', [Validators.required]],
      isActive: !['', [Validators.required]]
    })

    this.formGroup.valueChanges.subscribe((value: any) => { })
  }

  handleInputChange(event: any) {
    this.formGroup.patchValue({ blogDate: event });
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  toggleActive() {
    this.isActive = !this.isActive;
    this.formGroup.patchValue({ isActive: this.isActive });

  }

  handleFormSubmit() {
    // if (this.formGroup.invalid) {
    //   const invalidControls = findInvalidControlsRecursive(this.formGroup);
    //   return;
    // }
    if (this.blogId === 0) this.saveNewBlog();
    else this.updateBlog();
  }

  saveNewBlog() {
    let blogDate = this.formGroup.get('blogDate')?.value;
    blogDate = blogDate ? moment(blogDate).format() : moment().format()
    const formVal = { ...this.formGroup.value, blogImagePath: '', isActive: this.isActive, blogDate };
    const formData = new FormData();
    formData.append('blogModel', JSON.stringify(formVal));
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    }
    this.blogService.saveBlog(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl('blog');
          this.blogService.setRequestStatus(true, 'add');
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage(error?.message, AlertType.error);
      }
    });
  }
  updateBlog() {
    const blogId = this.blogDetails['blogId'];
    const formVal = this.formGroup.value;
    const payload = { ...formVal, blogId, blogImagePath: "", blogDate: moment(formVal?.blogDate).format() }
    const formData = new FormData();
    if (this.selectedImage) {
      formData.append('file', this.selectedImage, this.selectedImage.name);
    } else {
      payload['blogImagePath'] = this.blogDetails['blogImagePath']
    }
    formData.append('blogModel', JSON.stringify(payload));
    console.log('changed image', this.selectedImage);
    console.log('paylod', payload);

    this.blogService.updateBlog(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.router.navigateByUrl('blog');
          this.blogService.setRequestStatus(true, 'update');
        }
      },
      error: (error) => {
        const err = error?.error;
        console.log('err: ', err);
        this.alertService.setAlertMessage(err?.title, AlertType.error);
      }
    });
  }

}

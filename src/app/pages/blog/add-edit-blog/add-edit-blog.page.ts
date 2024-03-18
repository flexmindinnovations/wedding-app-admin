import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillConfig } from 'ngx-quill';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.page.html',
  styleUrls: ['./add-edit-blog.page.scss'],
})
export class AddEditBlogPage implements OnInit {

  formGroup!: FormGroup;
  isEditMode: boolean = false;
  blogId = 0;
  blogDetails: any = null;
  isDataLoaded = false;
  router = inject(Router);
  fb = inject(FormBuilder)
  activeRouter = inject(ActivatedRoute);
  alertService = inject(AlertService);

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
  }


  ngAfterViewInit(): void {
    this.activeRouter.params.subscribe((params: any) => {
      this.blogId = params && params['id'] ? params['id'] : 0;
      if (this.blogId > 0) this.getBlogDetails();
      else this.isDataLoaded = true;
    })
  }

  getBlogDetails() {

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      htmlText: !['', Validators.required],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      date: ['', [Validators.required]],
      isActive: ['', [Validators.required]]
    })

    this.formGroup.valueChanges.subscribe((value: any) => { })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  handleFormSubmit() {

  }

}

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuillConfig } from 'ngx-quill';

@Component({
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.page.html',
  styleUrls: ['./add-edit-blog.page.scss'],
})
export class AddEditBlogPage implements OnInit {

  formGroup!: FormGroup;

  fb = inject(FormBuilder)

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


  handleFormSubmit(){
    
  }

}

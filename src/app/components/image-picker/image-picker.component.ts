import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Input() label: string = '';
  @Input() id: string = '';
  @Input() showPreview: boolean = true;
  @Input() src: string = '';
  imagePath: string = '';
  imgSrc: any;

  @Output() selectedImage = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.imagePath = this.imagePath ? this.imagePath : 'No File chosen';
    this.imgSrc = this.imgSrc ? this.imgSrc : '/assets/image/image-placeholder.png';
  }

  handleImageChange(event: any) {
    const files = event?.target?.files;
    if (files.length === 1) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = reader.result;
        this.src = this.src ? this.src : this.imgSrc;
        const params = { id: this.id, file }
        this.selectedImage.emit(params);
      }

      reader.readAsDataURL(file);
    }
  }

}

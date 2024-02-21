import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Input() label: string = '';
  @Input() showPreview: boolean = true;

  imagePath: string = '';
  imgSrc: string = '';

  constructor() { }

  ngOnInit() {
    this.imagePath = this.imagePath ? this.imagePath : 'No File choosen';
    this.imgSrc = this.imgSrc ? this.imgSrc : '/assets/image/image-placeholder.png';
  }

}

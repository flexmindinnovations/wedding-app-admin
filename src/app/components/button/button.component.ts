import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() textOnly = false;
  colorScheme: any = 'red';

  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : 'red';
  }


  handleButtonClick() {
    this.action.emit();
  }
}

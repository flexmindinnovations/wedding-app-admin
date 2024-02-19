import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { buttonThemeVariables, themeVariables } from 'src/util/util';

@Component({
  selector: 'mt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})

export class ButtonComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() textOnly = false;
  @Input('iconSlot') iconSlot: 'start' | 'end' = 'start';
  colorScheme: any = 'red';
  colorVarients: any = {
    red: ''
  };

  @Output() action = new EventEmitter();
  constructor() {
    this.setCurrentClass();
  }

  ngOnInit() {
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : 'red';
    this.colorVarients = buttonThemeVariables[this.colorScheme];
  }


  handleButtonClick() {
    this.action.emit();
  }
}

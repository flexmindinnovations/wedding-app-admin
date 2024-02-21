import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COLOR_SCHEME, buttonThemeVariables, themeVariables } from 'src/util/util';

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
  @Input('disabled') isDisabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'lg';
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
  }


  handleButtonClick() {
    this.action.emit();
  }
}

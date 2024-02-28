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
  @Input() iconOnly = false;
  @Input('iconSlot') iconSlot: 'start' | 'end' = 'start';
  @Input('disabled') isDisabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'lg';
  @Input() isCancel: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  cancelButtonStyle: any;

  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
    this.cancelButtonStyle = `px-5 py-2.5 text-gray-700 rounded-md shadow-none hover:bg-gray-100 hover:text-gray-700 border border-gray-500 disabled:bg-transparent disabled:hover:bg-transparent disabled:cursor-not-allowed`;
  }


  handleButtonClick() {
    this.action.emit({ isCancel: this.isCancel });
  }
}

import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, buttonThemeVariables, iconSize, themeVariables } from 'src/util/util';

@Component({
  selector: 'mt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})

export class ButtonComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() severity: string = '';
  @Input() iconPos: ButtonIconPosition = 'left';
  @Input() textOnly = false;
  @Input() hybrid = false;
  @Input() iconOnly = false;
  @Input() buttonType: ButtonTypes = 'default';
  @Input('iconSlot') iconSlot: 'start' | 'end' = 'start';
  @Input('disabled') isDisabled = false;
  @Input() size: ButtonSize = 'small';
  @Input() isCancel: boolean = false;
  @Input() isDelete: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  buttonStyle: any;
  iconSize: string = '';

  @Output() action = new EventEmitter();
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.setCurrentClass();

    this.sharedService.getImagesSelected().subscribe((isSelected: any) => {
      this.isDisabled = !isSelected;
    })
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
    this.buttonStyle = this.isCancel ? `px-5 py-2.5 text-gray-700 rounded-md shadow-none hover:bg-gray-100 hover:text-gray-700 border border-gray-500 disabled:bg-transparent disabled:hover:bg-transparent disabled:cursor-not-allowed` : buttonThemeVariables['red'][this.size];
    this.iconSize = iconSize[this.size];
  }


  handleButtonClick() {
    this.action.emit({ isCancel: this.isCancel });
  }
}
export type ButtonSize = 'small' | 'large';
export type ButtonTypes = 'normal' | 'default' | 'danger' | 'success';
type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { COLOR_SCHEME, dropdownThemeVariables } from 'src/util/util';
import { Dropdown } from 'flowbite';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  toggleIcon: any = 'down';
  isOpen: boolean = false;
  @Input() label: string = '';
  @Input() formControlName: string = '';
  @Input() control!: FormControl;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() cssClasses: any;
  @Input() options: any[] = [];
  @Input() isMultiSelect: boolean = false;

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  value: any;
  buttonId = 'dropdownSearchButton';
  menuId: any = 'dropdownMenuEl';

  onChange(value: any) { }
  onTouched() { }

  isVisible = false;

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  dropdownIcon = 'chevron-down-outline';
  dropdown: any;

  dropdownOptions: any = {
    placement: 'bottom',
    triggerType: 'click',
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    ignoreClickOutsideClass: false,
    onHide: () => {
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    },
    onShow: () => {
      // console.log('dropdown has been shown');
    },
    onToggle: () => {
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    },
  }

  instanceOptions = {
    id: 'dropdownMenu',
    override: true
  };

  @ViewChild('triggerButton', { static: true }) triggerButton!: ElementRef;
  @ViewChild('menuEl', { static: true }) menuEl!: ElementRef;
  menuWidth: any;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = dropdownThemeVariables[this.colorScheme];
  }

  ngOnInit() {
    this.buttonId = `${this.label}-${this.buttonId}`;
    this.menuId = `${this.label}-${this.menuId}`;
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
    this.toggleIcon = this.isOpen ? 'up' : 'down';
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.onSelectionChange.emit(obj);
    this.onChange(obj?.id);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // this.disabled = isDisabled;
  }

  handleOnChange(event: any) {
    const value = event.target.value;
    this.onChange(value);
  }

  handleDropdownToggle() {
    const targetEl = document.getElementById(this.menuId);
    const triggerEl = document.getElementById(this.buttonId);
    setTimeout(() => {
      this.dropdown = new Dropdown(targetEl, triggerEl, this.dropdownOptions, this.instanceOptions);
      if (this.isVisible) this.dropdown.hide();
      else this.dropdown.show();
      this.menuWidth = this.triggerButton.nativeElement.offsetWidth + 'px';
      const buttonOffset = this.triggerButton.nativeElement.offsetWidth;
      const menuEl: Element | any = document.querySelector(`#${this.menuId}`);
      const matrix = this.getTransform(this.menuEl.nativeElement);
      const customTranslation = `translate3d(${buttonOffset}, ${matrix[1]}, ${matrix[2]})`;
      menuEl.style.transform = customTranslation;
      this.isVisible = !this.isVisible;
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    })
  }

  getTransform(el: Element) {
    var transform = window.getComputedStyle(el, null).getPropertyValue('transform');
    function rotate_degree(matrix: any) {
      if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      } else {
        var angle = 0;
      }
      return (angle < 0) ? angle += 360 : angle;
    }

    let results: any = transform.match(/matrix(?:(3d)\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*)), -{0,1}\d+\.?\d*\)|\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))\))/);

    let result: any = [0, 0, 0];
    if (results) {
      if (results[1] == '3d') {
        result = results.slice(2, 5);
      } else {
        results.push(0);
        result = results.slice(5, 9); // returns the [X,Y,Z,1] value;
      }

      result.push(rotate_degree(transform));
    };
    return result;
  }

  onItemChange(event: any) {
    this.writeValue(event);
    this.dropdown.hide();
    this.isVisible = !this.isVisible;
    this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
  }
}
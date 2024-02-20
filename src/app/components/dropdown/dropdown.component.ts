import { Component, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
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
  value: any;
  buttonId = 'dropdownSearchButton';
  menuId = 'dropdownMenuEl';

  onChange(value: any) { }
  onTouched() { }

  isVisible = false;

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  dropdownIcon = 'chevron-down-outline';

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
      console.log('dropdown has been shown');
    },
    onToggle: () => {
      console.log('dropdown has been toggled');
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    },
  }

  instanceOptions = {
    id: 'dropdownMenu',
    override: true
  };

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
    this.isVisible = !this.isVisible;
    const targetEl = document.getElementById(this.menuId);
    const triggerEl = document.getElementById(this.buttonId);
    const dropdown = new Dropdown(targetEl, triggerEl, this.dropdownOptions, this.instanceOptions);
    if (dropdown.isVisible()) dropdown.hide();
    else dropdown.show();

    // if(targetEl?.classList.contains('hidden')) {
    //   targetEl?.classList.remove('hidden');
    //   targetEl.classList.add('block');
    // } else {
    //   targetEl?.classList.remove('block');
    //   targetEl?.classList.add('hidden');
    // }
    this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
  }
}

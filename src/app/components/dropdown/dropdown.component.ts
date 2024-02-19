import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { dropdownThemeVariables } from 'src/util/util';

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
  @Input() options: any[] = [];
  value: any;

  onChange(value: any) { }
  onTouched() { }

  colorScheme: any = 'red';
  colorVarients: any = {
    red: ''
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
    this.colorScheme = colorScheme ? colorScheme : 'red';
    this.colorVarients = dropdownThemeVariables[this.colorScheme];
  }

  ngOnInit() { }

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
}

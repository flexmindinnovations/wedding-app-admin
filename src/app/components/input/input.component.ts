import { Component, Input, OnInit, Optional, Self, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorConnector } from './control-value-accessor';
import { IonicModule } from '@ionic/angular';
import { COLOR_SCHEME, inputThemeVariables } from 'src/util/util';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'number' | 'date' = 'text';
  @Input() formControlName: string = '';
  @Input() control!: FormControl;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() isMultiline: boolean = false;
  @Input('required') isRequired: true | false = false;
  value: any;
  pickerFormat: string = 'DD MM YYYY';

  onChange(value: any) { }
  onTouched() { }

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  ngOnInit(): void {
    // if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
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

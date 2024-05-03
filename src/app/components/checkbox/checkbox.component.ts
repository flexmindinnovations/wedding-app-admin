import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, ViewChild, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { COLOR_SCHEME, inputThemeVariables } from 'src/util/util';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'mt-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {


  @Input() label: string = '';
  @Input() labelPosition: labelPosition = 'right';
  @Input() formControlName: string = '';
  @Input() control!: FormControl | any;
  @Input() controlValue: string = '';
  @Output() onToggle: EventEmitter<string> = new EventEmitter();

  value: any;
  id = uuidv4();

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  onChange(value: any) { }
  onTouched() { }

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
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

  handleToggle(event: any) {
    this.onToggle.emit(event);
    this.onChange(event);
    this.value = event;
  }

  ngOnDestroy(): void {
    this.value = '';
  }

}

type labelPosition = 'left' | 'right';
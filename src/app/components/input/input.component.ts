import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { COLOR_SCHEME, inputThemeVariables } from 'src/util/util';
import { v4 as uuidv4 } from 'uuid';

declare var Datepicker: any;
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() label: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'date' = 'text';
  @Input() formControlName: string = '';
  @Input() control!: FormControl | any;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() isMultiline: boolean = false;
  @Input('required') isRequired: true | false = false;
  @Input() placeholder: string = '';
  @Input() controlValue: string = '';
  @Input() presentaion: 'date' | 'time' | 'date-time' | undefined;
  @Output() inputValue: EventEmitter<string> = new EventEmitter();
  value: any;
  pickerFormat: string = 'DD MM YYYY';

  cdr = inject(ChangeDetectorRef);

  onChange(value: any) { }
  onTouched() { }

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';
  datePicker: any;
  datePickerId = uuidv4();

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : this.label ? 'Enter ' + this.label : '';
  }

  ngAfterViewInit(): void {
    const control: any = this.control;
    const controlName = (Object.keys(control.parent.controls).find(key => control.parent.controls[key] === control));
    if(this.value || this.controlValue) this.formatInputData(controlName);
    this.cdr.detectChanges();
    const dtEl: any = document.getElementById(this.datePickerId);
    if (this.type === 'date') this.initDatePicker(dtEl);
  }

  formatInputData(controlName: any) {
    if (this.type === 'date') {
      this.value = this.value ? new Date(this.value).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    }
    // switch (controlName) {
    //   case 'dateOfBirth' && this.type === 'date':
    //     this.value = this.value ? new Date(this.value).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    //     break;
    // }
  }

  initDatePicker(element: any) {
    const today = new Date();
    element.value = this.value ? new Date(this.value).toISOString().split('T')[0] : today.toISOString().split('T')[0];
    // this.datePicker = new Datepicker(element, {
    //   theme: 'dark',
    //   autohide: true,
    //   todayHighlight: true,
    //   // maxDate: new Date(),
    //   autoselectToday: true,
    //   defaultDate: new Date('02/25/2022'),
    //   format: 'dd/mm/yyyy',
    // });

    // const datePickerParentEl: any = document.getElementsByClassName('datepicker-dropdown')[0];
    // const observer = new MutationObserver((mutations) => {
    //   mutations.forEach((mutation: any) => {
    //     if (mutation.attributeName === 'class') {
    //       const parentWidth = document.getElementsByClassName('picker-container')[0].clientWidth;
    //       document.getElementsByClassName('datepicker-picker')[0].setAttribute('style', `width: ${parentWidth}px !important`);
    //       document.getElementsByClassName('days')[0].setAttribute('style', `width: 100%`);
    //       document.getElementsByClassName('months')[0]?.setAttribute('style', `width: auto !important`);
    //       document.getElementsByClassName('years')[0]?.setAttribute('style', `width: 100%`);
    //       document.getElementsByClassName('days-of-week')[0].setAttribute('style', `width: 100%`);
    //       document.getElementsByClassName('datepicker-grid')[0].setAttribute('style', `width: 100%`);
    //     }
    //   })
    // })

    // observer.observe(datePickerParentEl, {
    //   attributes: true,
    //   attributeFilter: ['class'],
    //   childList: false,
    //   characterData: false
    // })
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
  handleOnChange(event: any, src?: string) {
    const value = src === 'time' ? event : event.target.value;
    // if (src === 'dt') console.log('value: ', value);
    const formattedValue = src === 'dt' ? new Date(value).toLocaleDateString('en-GB') : value;
    this.inputValue.emit(formattedValue);
    this.onChange(value);
  }

}

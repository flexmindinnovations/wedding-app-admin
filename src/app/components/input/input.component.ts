import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { COLOR_SCHEME, inputThemeVariables } from 'src/util/util';

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
  @Output() inputValue: EventEmitter<string> = new EventEmitter();
  value: any;
  pickerFormat: string = 'DD MM YYYY';

  cdr = inject(ChangeDetectorRef);

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
    this.placeholder = this.placeholder ? this.placeholder : this.label ? 'Enter ' + this.label : '';
  }

  ngAfterViewInit(): void {
    const dtEl: any = document.getElementById('datepicker01');
    if (this.type === 'date') this.initDatePicker(dtEl);
    const controlName = (Object.keys(this.control.parent.controls).find(key => this.control.parent.controls[key] === this.control));
    this.formatInputData(controlName);
    this.cdr.detectChanges();
  }

  formatInputData(controlName: any) {
    switch (controlName) {
      case 'dateOfBirth':
        this.value = new Date(this.value).toLocaleDateString('en-GB');
        break;
    }
  }

  initDatePicker(element: Element) {
    new Datepicker(element, {
      theme: 'dark',
      autohide: true,
      todayHighlight: true,
      maxDate: new Date(),
      autoselectToday: true,
      datepickerButtons: true
    });
    const datePickerParentEl: any = document.getElementsByClassName('datepicker-dropdown')[0];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation: any) => {
        if (mutation.attributeName === 'class') {
          const parentWidth = document.getElementsByClassName('picker-container')[0].clientWidth;
          document.getElementsByClassName('datepicker-picker')[0].setAttribute('style', `width: ${parentWidth}px`);
          document.getElementsByClassName('days')[0].setAttribute('style', `width: 100%`);
          document.getElementsByClassName('months')[0]?.setAttribute('style', `width: 100%`);
          document.getElementsByClassName('years')[0]?.setAttribute('style', `width: 100%`);
          document.getElementsByClassName('days-of-week')[0].setAttribute('style', `width: 100%`);
          document.getElementsByClassName('datepicker-grid')[0].setAttribute('style', `width: 100%`);
        }
      })
    })

    observer.observe(datePickerParentEl, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false
    })
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
    const value = event.target.value;
    const formattedValue = src === 'dt' ? new Date(value).toLocaleDateString('en-GB') : value;
    this.inputValue.emit(formattedValue);
    this.onChange(value);
  }

}

import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit, AfterViewInit {

  hoursData: any;
  minutesData: any;
  amPmData: any;

  selectedHour: any;
  selectedMinutes: any;
  selectedAmPm: any;
  @Output() selectedTime: any = new EventEmitter();

  hour: any;
  minute: any;
  ampm: any;

  constructor() {
    const d = new Date();
    let hours: any = (d.getHours() + 24) % 12 || 12;
    let minutes: any = d.getMinutes().toString();
    const amPm = d.getHours() >= 12 ? 'pm' : 'am';
    hours = hours < 10 ? '0' + hours.toString() : hours.toString();
    minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    this.hour = hours.toString();
    this.minute = minutes.toString();
    this.ampm = amPm;
  }

  ngOnInit() {
    this.setHours();
  }

  ngAfterViewInit(): void {
    const isTimeSelected = this.hour && this.minute && this.ampm ? true : false;
    if (isTimeSelected) this.selectedTime.emit(`${this.hour}:${this?.minute}:${this?.ampm.toUpperCase()}`);
  }

  setHours() {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      const hoursObj = { id: i, value: i < 10 ? '0' + i.toString() : i.toString(), title: i < 10 ? '0' + i.toString() : i.toString() }
      hours.push(hoursObj);
    }
    this.hoursData = hours;
    this.setMinutes();
  }

  setMinutes() {
    const minutes = [];
    for (let i = 1; i <= 60; i++) {
      const minutObj = { id: i, value: i < 10 ? '0' + i.toString() : i.toString(), title: i < 10 ? '0' + i.toString() : i.toString() }
      minutes.push(minutObj);
    }
    this.minutesData = minutes;
    this.setAmPm();
  }

  setAmPm() {
    this.amPmData = [
      { id: 1, value: 'am', title: 'AM' },
      { id: 2, value: 'pm', title: 'PM' }
    ]
  }

  handleSelectionChange(event: any, src: string) {
    const value = event?.target?.value;
    switch (src) {
      case 'hour':
        this.selectedHour = value.toString();
        break;
      case 'minutes':
        this.selectedMinutes = value.toString();
        break;
      case 'ampm':
        this.selectedAmPm = value.toString();
        break;
    }
    const isTimeSelected = this.selectedHour && this.selectedMinutes && this.selectedAmPm ? true : false;
    if (isTimeSelected) this.selectedTime.emit(`${this.selectedHour}:${this.selectedMinutes}:${this.selectedAmPm.toUpperCase()}`);
  }
}

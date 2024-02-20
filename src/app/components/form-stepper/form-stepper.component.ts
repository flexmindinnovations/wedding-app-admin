import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { FormStep } from 'src/app/interfaces/form-step-item';
import { StepperFormItem } from 'src/app/interfaces/stepper-form';
import { FormStepperService } from 'src/app/services/form-stepper.service';
import { COLOR_SCHEME, stepperThemeVariables } from 'src/util/util';

@Component({
  selector: 'form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
})
export class FormStepperComponent implements OnInit, OnChanges {

  @Input() completedStepInfo: FormStep | any;
  colorScheme: any = COLOR_SCHEME;
  registrationSteps: StepperFormItem[] = [];
  formStepperService = inject(FormStepperService);

  currentStepData!: FormStep;

  colorVarients: any;
  constructor() {
    this.setCurrentClass();
  }

  ngOnInit() {
    this.getFormStepperItems();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const currentValue = simpleChanges['completedStepInfo'].currentValue;
    if (currentValue) {
      this.currentStepData = currentValue;
      this.proceedToNextStep(this.currentStepData);
    }
  }

  proceedToNextStep(stepData: FormStep) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    const nextItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.id === stepData?.formId + 1);
    if (nextItemIndex > -1) {
      this.registrationSteps[nextItemIndex].isActive = true;
    }
  }

  getFormStepperItems() {
    this.formStepperService.getFormStepperItems().subscribe((items: StepperFormItem[]) => {
      this.registrationSteps = items.map((item: StepperFormItem) => {
        if (item.id === 1) {
          item.isActive = true;
        }
        return item;
      });
    })
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = stepperThemeVariables[this.colorScheme];
  }

}

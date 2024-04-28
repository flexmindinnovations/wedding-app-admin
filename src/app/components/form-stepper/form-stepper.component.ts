import { ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { StepperFormItem } from 'src/app/interfaces/stepper-form';
import { FormStepperService } from 'src/app/services/form-stepper.service';
import { COLOR_SCHEME, stepperThemeVariables } from 'src/util/util';

@Component({
  selector: 'form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
})
export class FormStepperComponent implements OnInit, OnChanges, OnDestroy {

  @Input() completedStepInfo: FormStep | any;
  colorScheme: any = COLOR_SCHEME;
  registrationSteps: StepperFormItem[] = [];
  formStepperService = inject(FormStepperService);

  currentStepData!: FormStep;
  themesParams = stepperThemeVariables['lastItem'];

  stepperRoutes = ['personal', 'family', 'contact', 'other', 'photos'];

  colorVarients: any;
  constructor(
    private router: Router,
    public cdref:ChangeDetectorRef
  ) {
    this.setCurrentClass();
  }

  @Input() template: any;
  active: number = 0;

  @HostListener('window:onload', ['$event'])
  onPageRefresh() {
    console.log('on window refresh: ');
    this.setCurrentStep();
  }


  ngOnInit() {
    this.cdref.detectChanges();
    this.getFormStepperItems();
    this.router.events.subscribe((events: any) => {
      this.setCurrentStep();
    })
  }

  setCurrentStep() {
    const currentUrl = this.router.url;
    const activeRoute = this.router.url.substring(currentUrl.lastIndexOf('/') + 1, this.router.url.length);
    console.log({ currentUrl, activeRoute, stepperRoutes: this.stepperRoutes });

    if (activeRoute && this.stepperRoutes.includes(activeRoute)) this.setActiveStep(activeRoute);
  }

  setActiveStep(activeRoute: string) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    console.log('registrationSteps: ', this.registrationSteps);

    const activeItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.route === activeRoute);
    console.log('activeItemIndex: ', activeItemIndex);

    if (activeItemIndex > -1) this.registrationSteps[activeItemIndex].isActive = true;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const currentValue = simpleChanges['completedStepInfo'].currentValue;
    if (currentValue) this.handleStepperDirection(currentValue);
  }

  handleStepperDirection(value: any) {
    this.currentStepData = value;
    if (value.action === ActionValue.previous) this.proceedToPreviousStep(value);
    else this.proceedToNextStep(value);
  }

  proceedToPreviousStep(stepData: FormStep) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    const previousPage: any = stepData?.formId - 1;
    const previousItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.id === (previousPage >= 1 ? previousPage : previousPage));
    this.registrationSteps[previousItemIndex].isActive = true;
  }

  proceedToNextStep(stepData: FormStep) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    const totalSteps = this.registrationSteps.length;
    const nextPage: any = stepData?.formId < totalSteps ? stepData?.formId + 1 : stepData?.formId;
    const nextItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.id === nextPage);
    this.registrationSteps[nextItemIndex].isActive = true;
    this.registrationSteps[nextItemIndex - 1].isCompleted = stepData.isCompleted;
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

  handleOnStepperClick(step: StepperFormItem) {
    // console.log('step: ', step);

  }

  ngOnDestroy(): void {
    this.registrationSteps = [];
  }
}


import { Component, HostListener, OnInit, isDevMode, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AlertType } from 'src/app/enums/alert-types';
import { FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { StepPath, generateTxnId, paymentHtmlPayload } from 'src/util/util';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {
  showPaymentConfirmationDialog = false;
  isLoading = false;
  public screenWidth: any;
  formGroup!: FormGroup;
  userData = signal<any>({});
  customerId = 0;
  paymentMode: string = 'cash';
  activePath: string = StepPath.PAYMENT;
  isPaymentInfoFill: boolean = false;
  isPaymentHistoryAvailable: boolean = false;

  currentCustomerPaymentDetails: any;
  customerPaymentHistory: any[] = [];
  amountOptions: any = [];
  cardItems: any[] = [];
  cashAmount: string = '1499';

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private customerRegistrationService: CustomerRegistrationService,
    private router: Router,
    private alertService: AlertService,
    private activedRoute: ActivatedRoute
  ) {
    this.onResize();
  }

  ngOnInit() {

    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required]],
    })
    this.getPlanAmount();
    this.setCardItems();
    this.activedRoute.params.subscribe((params) => {
      const urlPath = window.location.pathname;
      const splittedUrl = urlPath.split('/');
      const extractCustomerId = Number(splittedUrl[splittedUrl.length - 2]);
      if (extractCustomerId && typeof extractCustomerId === 'number') {
        this.getCustomerDetails(extractCustomerId);
      }
    })
  }

  setCardItems() {
    this.sharedService.getMembershipPlanList().subscribe({
      next: (response) => {
        if (response) {
          this.cardItems = response.map((plan: any) => ({
            planName: plan.planName || '',
            planType: plan.planType || '',
            styleClass: plan.styleClass || '',
            planFeature: [
              { id: 1, text: 'Access to unlimited profiles' }
            ],
            originalAmount: plan.originalAmount || 0,
            discountAmount: plan.discountAmount || 0,
            actualAmount: plan.actualAmount || '',
            planStartDate: moment(plan.planStartDate || new Date()),
            actionName: `Get ${plan.planName}` || '',
            isActive: plan.isActive || false,
            isSelected: false
          }));
          this.cardItems = this.cardItems.sort((plan1: any, plan2: any) => plan1.discountAmount - plan2.discountAmount);
          if (this.cardItems && this.cardItems.length > 0) {
            this.cardItems[0].isSelected = true;
            const amount = this.cardItems[0]?.discountAmount;
            this.formGroup.patchValue({ amount });
          }
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
    // this.cardItems = [
    //   {
    //     planName: 'Amazing Plan',
    //     planType: 'Basic',
    //     styleClass: '',
    //     planFeature: [
    //       { id: 1, text: 'Access upto 50 profiles per week' }
    //     ],
    //     originalAmount: 2499,
    //     discountAmount: 1499,
    //     actualAmount: '',
    //     planStartDate: moment(new Date()),
    //     actionName: 'Get Amazing Plan',
    //     isActive: true
    //   },
    //   {
    //     planName: 'Delux',
    //     planType: 'Delux',
    //     planFeature: [
    //       { id: 1, text: 'Access to unlimited profiles' }
    //     ],
    //     styleClass: 'pricing',
    //     originalAmount: 5000,
    //     discountAmount: 2499,
    //     actualAmount: '',
    //     planStartDate: moment(new Date()),
    //     actionName: 'Get Delux',
    //     isActive: true
    //   }
    // ];
  }
  getPlanAmount() {
    this.sharedService.getMembershipPlanList().subscribe({
      next: (response) => {
        if (response) {
          this.amountOptions = response.map((plan: any) => ({
            id: plan.actualAmount,
            title: plan.actualAmount,
          }));
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error);
      }
    });
  }

  onPlanClick(item: any) {
    this.cardItems.forEach((each) => each.isSelected = false);
    item.isSelected = true;
    const amount = item?.discountAmount;
    this.formGroup.patchValue({ amount });
  }

  setStepperData(isPersonInfoFill: boolean, isFamilyInfoFill: boolean, isContactInfoFill: boolean, isOtherInfoFill: boolean, isImagesAdded: boolean, isPaymentInfoFill: boolean) {
    const props: FormStep = {
      source: StepPath.PAYMENT,
      data: [],
      formId: 6,
      active: this.activePath === StepPath.PAYMENT,
      isCompleted: isPaymentInfoFill,
      completeKey: StepPath.PAYMENT,
      steps: { personal: isPersonInfoFill, family: isFamilyInfoFill, contact: isContactInfoFill, other: isOtherInfoFill, photos: isImagesAdded },
      previous: {
        source: StepPath.PHOTOS,
        data: {},
        formId: 4,
        active: this.activePath === StepPath.PHOTOS,
        isCompleted: isImagesAdded
      },
      next: null
    }
    this.sharedService.stepData.next(props);
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  getCustomerDetails(customerId: any): void {
    this.isLoading = true;
    this.customerRegistrationService.getCustomerDetailsById(customerId).subscribe({
      next: (data: any) => {
        if (data) {
          const { customerUserName, contactInfoModel, personalInfoModel, currentCustomerPayment, paymentHistoryList, isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded, isPaymentInfoFill } = data;

          this.isPaymentHistoryAvailable = paymentHistoryList?.length > 0 ? true : false;
          this.isPaymentInfoFill =
            this.currentCustomerPaymentDetails = currentCustomerPayment;
          this.customerPaymentHistory = paymentHistoryList;
          const userFormObject = {
            mobile: customerUserName,
            firstName: personalInfoModel?.firstName,
            lastName: personalInfoModel?.lastName,
            email: contactInfoModel?.emailId
          }
          this.userData.set(userFormObject);
          this.formGroup.patchValue(userFormObject);
          this.formGroup.disable();
          this.formGroupControl['email'].enable();
          this.formGroupControl['mobile'].enable();

          this.customerId = data?.customerId
          this.isPaymentInfoFill = data?.isPaymentInfoFill;
          if (isImagesAdded) {
            this.setStepperData(isPersonInfoFill, isFamilyInfoFill, isContactInfoFill, isOtherInfoFill, isImagesAdded, isPaymentInfoFill);
          } else {
            this.router.navigateByUrl(`customers/edit/${customerId}/photos`);
          }

          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    })
  }

  handlePayment() {
    if (this.formGroup.valid) {
      const formVal = this.formGroup.getRawValue();
      const payload: any = {};
      for (let key in formVal) {
        if (formVal[key]) payload[key] = formVal[key]
      }
      const appEnv = isDevMode() ? 'local' : 'prod';
      this.paymentCall(appEnv, payload);
    }
  }

  showPopup() {
    this.showPaymentConfirmationDialog = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }


  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }
  isAnyCardSelected(): boolean {
    return this.cardItems.some(item => item.isSelected);
  }

  handleSubmit() {
    const payload = {
      "customerPaymentId": 0,
      "customerId": this.customerId,
      "mihpayid": "",
      "mode": "CASH",
      "txnid": "",
      "amount": parseFloat(this.cashAmount),
      "discount": 0,
      "net_amount_debit": 0,
      "bank_ref_num": "",
      "paymentDate": moment().toISOString(),
      "paymentStatus": "success",
      "paymentMode": "CASH"
    }

    this.sharedService.saveCustomerPayment(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.setAlertMessage('Payment collected at source', AlertType.success);
          this.showPaymentConfirmationDialog = false;
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error while processing payment at source', AlertType.error);
        this.showPaymentConfirmationDialog = false;
      }
    })
  }

  paymentCall(appEnv: any, payload: any) {
    this.sharedService.getPaymentObj(appEnv, payload).subscribe({
      next: (res: any) => {
        if (res) {
          console.clear();
          const data = res?.info;
          const htmlPaymentString = paymentHtmlPayload(data, appEnv);
          const winUrl = URL.createObjectURL(
            new Blob([htmlPaymentString], { type: "text/html" })
          );
          window.location.href = winUrl;
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
      }
    })
  }

  getPaymentMode(mode: string) {
    let paymentMode: string = '';
    switch (mode) {
      case 'CC':
        paymentMode = 'Credit Card';
        break;
      case 'DC':
        paymentMode = 'Debit Card';
        break;
      case 'NB':
        paymentMode = 'Net Banking';
        break;
      case 'CASH':
        paymentMode = 'Cash Payment';
        break;
      case 'UPI':
        paymentMode = 'UPI';
        break;
    }

    return paymentMode;
  }

}

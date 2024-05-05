import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditSubscriptionPlanComponent } from './add-edit-subscription-plan.component';

describe('AddEditSubscriptionPlanComponent', () => {
  let component: AddEditSubscriptionPlanComponent;
  let fixture: ComponentFixture<AddEditSubscriptionPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSubscriptionPlanComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

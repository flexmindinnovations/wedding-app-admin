import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditCustomerPage } from './add-edit-customer.page';

describe('AddEditCustomerPage', () => {
  let component: AddEditCustomerPage;
  let fixture: ComponentFixture<AddEditCustomerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

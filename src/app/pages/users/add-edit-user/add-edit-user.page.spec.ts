import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditUserPage } from './add-edit-user.page';

describe('AddEditUserPage', () => {
  let component: AddEditUserPage;
  let fixture: ComponentFixture<AddEditUserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

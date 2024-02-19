import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditBranchPage } from './add-edit-branch.page';

describe('AddEditBranchPage', () => {
  let component: AddEditBranchPage;
  let fixture: ComponentFixture<AddEditBranchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditBranchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

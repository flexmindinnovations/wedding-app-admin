import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditEventPage } from './add-edit-event.page';

describe('AddEditEventPage', () => {
  let component: AddEditEventPage;
  let fixture: ComponentFixture<AddEditEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

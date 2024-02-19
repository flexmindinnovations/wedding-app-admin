import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditBlogPage } from './add-edit-blog.page';

describe('AddEditBlogPage', () => {
  let component: AddEditBlogPage;
  let fixture: ComponentFixture<AddEditBlogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

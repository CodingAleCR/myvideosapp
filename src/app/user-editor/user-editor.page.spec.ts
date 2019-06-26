import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditorPage } from './user-editor.page';

describe('UserEditorPage', () => {
  let component: UserEditorPage;
  let fixture: ComponentFixture<UserEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

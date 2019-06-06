import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideosPage } from './my-videos.page';

describe('MyVideosPage', () => {
  let component: MyVideosPage;
  let fixture: ComponentFixture<MyVideosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyVideosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVideosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

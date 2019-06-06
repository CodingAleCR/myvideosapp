import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditorPage } from './video-editor.page';

describe('VideoEditorPage', () => {
  let component: VideoEditorPage;
  let fixture: ComponentFixture<VideoEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

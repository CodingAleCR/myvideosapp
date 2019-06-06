import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistEditorPage } from './playlist-editor.page';

describe('PlaylistEditorPage', () => {
  let component: PlaylistEditorPage;
  let fixture: ComponentFixture<PlaylistEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

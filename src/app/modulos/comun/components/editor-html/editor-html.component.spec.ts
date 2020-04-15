import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorHtmlComponent } from './editor-html.component';

describe('EditorHtmlComponent', () => {
  let component: EditorHtmlComponent;
  let fixture: ComponentFixture<EditorHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

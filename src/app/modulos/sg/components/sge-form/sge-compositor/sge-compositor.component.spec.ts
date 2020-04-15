/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SgeCompositorComponent } from './sge-compositor.component';

describe('SgeCompositorComponent', () => {
  let component: SgeCompositorComponent;
  let fixture: ComponentFixture<SgeCompositorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgeCompositorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgeCompositorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ControlRiesgoComponent } from './control-riesgo.component';

describe('ControlRiesgoComponent', () => {
  let component: ControlRiesgoComponent;
  let fixture: ComponentFixture<ControlRiesgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlRiesgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

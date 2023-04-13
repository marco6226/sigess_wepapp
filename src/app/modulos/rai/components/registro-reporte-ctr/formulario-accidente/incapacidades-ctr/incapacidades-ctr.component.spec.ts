/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IncapacidadesCtrComponent } from './incapacidades-ctr.component';

describe('IncapacidadesCtrComponent', () => {
  let component: IncapacidadesCtrComponent;
  let fixture: ComponentFixture<IncapacidadesCtrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncapacidadesCtrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacidadesCtrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

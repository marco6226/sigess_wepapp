/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SgComponent } from './sg.component';

describe('SgComponent', () => {
  let component: SgComponent;
  let fixture: ComponentFixture<SgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

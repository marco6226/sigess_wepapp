/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SecComponent } from './sec.component';

describe('SecComponent', () => {
  let component: SecComponent;
  let fixture: ComponentFixture<SecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

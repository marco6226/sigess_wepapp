/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubcontratistasComponent } from './subcontratistas.component';

describe('SubcontratistasComponent', () => {
  let component: SubcontratistasComponent;
  let fixture: ComponentFixture<SubcontratistasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcontratistasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcontratistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

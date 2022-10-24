import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroReporteTemporalComponent } from './registro-reporte-temporal.component';

describe('RegistroReporteTemporalComponent', () => {
  let component: RegistroReporteTemporalComponent;
  let fixture: ComponentFixture<RegistroReporteTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroReporteTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroReporteTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

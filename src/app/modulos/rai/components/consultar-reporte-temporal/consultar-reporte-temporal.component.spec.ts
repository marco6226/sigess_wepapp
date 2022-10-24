import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarReporteTemporalComponent } from './consultar-reporte-temporal.component';

describe('ConsultarReporteTemporalComponent', () => {
  let component: ConsultarReporteTemporalComponent;
  let fixture: ComponentFixture<ConsultarReporteTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarReporteTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarReporteTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

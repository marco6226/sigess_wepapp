import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIncidenteTemporalComponent } from './formulario-incidente-temporal.component';

describe('FormularioIncidenteTemporalComponent', () => {
  let component: FormularioIncidenteTemporalComponent;
  let fixture: ComponentFixture<FormularioIncidenteTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioIncidenteTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioIncidenteTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

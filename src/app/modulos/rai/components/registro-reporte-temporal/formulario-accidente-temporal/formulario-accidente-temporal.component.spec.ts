import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAccidenteTemporalComponent } from './formulario-accidente-temporal.component';

describe('FormularioAccidenteTemporalComponent', () => {
  let component: FormularioAccidenteTemporalComponent;
  let fixture: ComponentFixture<FormularioAccidenteTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioAccidenteTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioAccidenteTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

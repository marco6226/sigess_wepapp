import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIncidenteComponent } from './formulario-incidente.component';

describe('FormularioIncidenteComponent', () => {
  let component: FormularioIncidenteComponent;
  let fixture: ComponentFixture<FormularioIncidenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioIncidenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioIncidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDesviacionInspeccionComponent } from './consulta-desviacion-inspeccion.component';

describe('ConsultaDesviacionInspeccionComponent', () => {
  let component: ConsultaDesviacionInspeccionComponent;
  let fixture: ComponentFixture<ConsultaDesviacionInspeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaDesviacionInspeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDesviacionInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

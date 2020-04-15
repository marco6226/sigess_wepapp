import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaObservacionesComponent } from './consulta-observaciones.component';

describe('ConsultaObservacionesComponent', () => {
  let component: ConsultaObservacionesComponent;
  let fixture: ComponentFixture<ConsultaObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

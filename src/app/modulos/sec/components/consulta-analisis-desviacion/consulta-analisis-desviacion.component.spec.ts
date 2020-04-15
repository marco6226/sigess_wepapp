import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAnalisisDesviacionComponent } from './consulta-analisis-desviacion.component';

describe('ConsultaAnalisisDesviacionComponent', () => {
  let component: ConsultaAnalisisDesviacionComponent;
  let fixture: ComponentFixture<ConsultaAnalisisDesviacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaAnalisisDesviacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

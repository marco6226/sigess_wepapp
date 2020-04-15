import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionDesempenoComponent } from './evaluacion-desempeno.component';

describe('EvaluacionDesempenoComponent', () => {
  let component: EvaluacionDesempenoComponent;
  let fixture: ComponentFixture<EvaluacionDesempenoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionDesempenoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionDesempenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

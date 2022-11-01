import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesComplementariaTemporalComponent } from './incapacidades-complementaria-temporal.component';

describe('IncapacidadesComplementariaTemporalComponent', () => {
  let component: IncapacidadesComplementariaTemporalComponent;
  let fixture: ComponentFixture<IncapacidadesComplementariaTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncapacidadesComplementariaTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacidadesComplementariaTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

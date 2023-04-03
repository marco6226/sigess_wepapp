import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndCasosMedicosGestionComponent } from './ind-casos-medicos-gestion.component';

describe('IndCasosMedicosGestionComponent', () => {
  let component: IndCasosMedicosGestionComponent;
  let fixture: ComponentFixture<IndCasosMedicosGestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndCasosMedicosGestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndCasosMedicosGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

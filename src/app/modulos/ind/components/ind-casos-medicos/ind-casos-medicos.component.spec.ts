import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndCasosMedicosComponent } from './ind-casos-medicos.component';

describe('IndCasosMedicosComponent', () => {
  let component: IndCasosMedicosComponent;
  let fixture: ComponentFixture<IndCasosMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndCasosMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndCasosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

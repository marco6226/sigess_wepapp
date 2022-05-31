import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificacionFactorCausalComponent } from './identificacion-factor-causal.component';

describe('IdentificacionFactorCausalComponent', () => {
  let component: IdentificacionFactorCausalComponent;
  let fixture: ComponentFixture<IdentificacionFactorCausalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificacionFactorCausalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificacionFactorCausalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorCausalComponent } from './factor-causal.component';

describe('FactorCausalComponent', () => {
  let component: FactorCausalComponent;
  let fixture: ComponentFixture<FactorCausalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactorCausalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorCausalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

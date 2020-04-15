import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisDesviacionComponent } from './analisis-desviacion.component';

describe('AnalisisDesviacionComponent', () => {
  let component: AnalisisDesviacionComponent;
  let fixture: ComponentFixture<AnalisisDesviacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisDesviacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

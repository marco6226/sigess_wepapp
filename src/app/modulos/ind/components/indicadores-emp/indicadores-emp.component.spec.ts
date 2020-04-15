import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresEmpComponent } from './indicadores-emp.component';

describe('IndicadoresEmpComponent', () => {
  let component: IndicadoresEmpComponent;
  let fixture: ComponentFixture<IndicadoresEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

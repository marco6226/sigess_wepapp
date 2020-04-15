import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTableroComponent } from './consulta-tablero.component';

describe('ConsultaTableroComponent', () => {
  let component: ConsultaTableroComponent;
  let fixture: ComponentFixture<ConsultaTableroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaTableroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaTableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

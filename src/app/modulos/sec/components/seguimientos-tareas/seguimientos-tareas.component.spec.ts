import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientosTareasComponent } from './seguimientos-tareas.component';

describe('SeguimientosTareasComponent', () => {
  let component: SeguimientosTareasComponent;
  let fixture: ComponentFixture<SeguimientosTareasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientosTareasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientosTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

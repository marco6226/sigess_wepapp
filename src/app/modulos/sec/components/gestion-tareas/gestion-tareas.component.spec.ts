import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTareasComponent } from './gestion-tareas.component';

describe('GestionTareasComponent', () => {
  let component: GestionTareasComponent;
  let fixture: ComponentFixture<GestionTareasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionTareasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosEquipoComponent } from './miembros-equipo.component';

describe('MiembrosEquipoComponent', () => {
  let component: MiembrosEquipoComponent;
  let fixture: ComponentFixture<MiembrosEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiembrosEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiembrosEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

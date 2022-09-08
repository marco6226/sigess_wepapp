import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoSstComponent } from './equipo-sst.component';

describe('EquipoSstComponent', () => {
  let component: EquipoSstComponent;
  let fixture: ComponentFixture<EquipoSstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipoSstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoSstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

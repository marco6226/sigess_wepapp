import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoSstListComponent } from './equipo-sst-list.component';

describe('EquipoSstListComponent', () => {
  let component: EquipoSstListComponent;
  let fixture: ComponentFixture<EquipoSstListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipoSstListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoSstListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

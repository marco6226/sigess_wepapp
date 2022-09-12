import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionColiderComponent } from './asignacion-colider.component';

describe('AsignacionColiderComponent', () => {
  let component: AsignacionColiderComponent;
  let fixture: ComponentFixture<AsignacionColiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionColiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionColiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

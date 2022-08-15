import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadosActualizarComponent } from './aliados-actualizar.component';

describe('AliadosActualizarComponent', () => {
  let component: AliadosActualizarComponent;
  let fixture: ComponentFixture<AliadosActualizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliadosActualizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliadosActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

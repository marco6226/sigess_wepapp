import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndCaracterizacionComponent } from './ind-caracterizacion.component';

describe('IndCaracterizacionComponent', () => {
  let component: IndCaracterizacionComponent;
  let fixture: ComponentFixture<IndCaracterizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndCaracterizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndCaracterizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

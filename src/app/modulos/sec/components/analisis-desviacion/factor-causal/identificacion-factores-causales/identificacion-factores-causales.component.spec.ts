import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificacionFactoresCausalesComponent } from './identificacion-factores-causales.component';

describe('IdentificacionFactoresCausalesComponent', () => {
  let component: IdentificacionFactoresCausalesComponent;
  let fixture: ComponentFixture<IdentificacionFactoresCausalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificacionFactoresCausalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificacionFactoresCausalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesContratadasComponent } from './actividades-contratadas.component';

describe('ActividadesContratadasComponent', () => {
  let component: ActividadesContratadasComponent;
  let fixture: ComponentFixture<ActividadesContratadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActividadesContratadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesContratadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCausasTemporalComponent } from './listado-causas-temporal.component';

describe('ListadoCausasTemporalComponent', () => {
  let component: ListadoCausasTemporalComponent;
  let fixture: ComponentFixture<ListadoCausasTemporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCausasTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCausasTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

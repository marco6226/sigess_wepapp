import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCausasComponent } from './listado-causas.component';

describe('ListadoCausasComponent', () => {
  let component: ListadoCausasComponent;
  let fixture: ComponentFixture<ListadoCausasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCausasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCausasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

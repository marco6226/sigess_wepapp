import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAccionListComponent } from './plan-accion-list.component';

describe('PlanAccionListComponent', () => {
  let component: PlanAccionListComponent;
  let fixture: ComponentFixture<PlanAccionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAccionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

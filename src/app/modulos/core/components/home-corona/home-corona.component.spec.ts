import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCoronaComponent } from './home-corona.component';

describe('HomeCoronaComponent', () => {
  let component: HomeCoronaComponent;
  let fixture: ComponentFixture<HomeCoronaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCoronaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCoronaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

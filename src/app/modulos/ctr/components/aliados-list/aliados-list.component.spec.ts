import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliadosListComponent } from './aliados-list.component';

describe('AliadosListComponent', () => {
  let component: AliadosListComponent;
  let fixture: ComponentFixture<AliadosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliadosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

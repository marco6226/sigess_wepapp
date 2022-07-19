import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReintegroComponent } from './reintegro.component';

describe('ReintegroComponent', () => {
  let component: ReintegroComponent;
  let fixture: ComponentFixture<ReintegroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReintegroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReintegroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

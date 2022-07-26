import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReintegroListComponent } from './reintegro-list.component';

describe('ReintegroListComponent', () => {
  let component: ReintegroListComponent;
  let fixture: ComponentFixture<ReintegroListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReintegroListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReintegroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

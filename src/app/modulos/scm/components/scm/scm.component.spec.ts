import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmComponent } from './scm.component';

describe('ScmComponent', () => {
  let component: ScmComponent;
  let fixture: ComponentFixture<ScmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

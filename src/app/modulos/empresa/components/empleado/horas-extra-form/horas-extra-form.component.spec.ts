import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasExtraFormComponent } from './horas-extra-form.component';

describe('HorasExtraFormComponent', () => {
  let component: HorasExtraFormComponent;
  let fixture: ComponentFixture<HorasExtraFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorasExtraFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorasExtraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

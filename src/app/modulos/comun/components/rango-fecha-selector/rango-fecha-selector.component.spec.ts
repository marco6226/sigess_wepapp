import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangoFechaSelectorComponent } from './rango-fecha-selector.component';

describe('RangoFechaSelectorComponent', () => {
  let component: RangoFechaSelectorComponent;
  let fixture: ComponentFixture<RangoFechaSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangoFechaSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangoFechaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

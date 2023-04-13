import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizPeligroComponent } from './matriz-peligro.component';

describe('MatrizPeligroComponent', () => {
  let component: MatrizPeligroComponent;
  let fixture: ComponentFixture<MatrizPeligroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrizPeligroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizPeligroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

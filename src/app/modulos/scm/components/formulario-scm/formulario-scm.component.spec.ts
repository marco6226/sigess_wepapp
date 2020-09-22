import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioScmComponent } from './formulario-scm.component';

describe('FormularioScmComponent', () => {
  let component: FormularioScmComponent;
  let fixture: ComponentFixture<FormularioScmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioScmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioScmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaIpecrComponent } from './consulta-ipecr.component';

describe('ConsultaIpecrComponent', () => {
  let component: ConsultaIpecrComponent;
  let fixture: ComponentFixture<ConsultaIpecrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaIpecrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaIpecrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

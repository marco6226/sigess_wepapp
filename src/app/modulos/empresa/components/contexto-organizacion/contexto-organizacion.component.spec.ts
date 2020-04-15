import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextoOrganizacionComponent } from './contexto-organizacion.component';

describe('ContextoOrganizacionComponent', () => {
  let component: ContextoOrganizacionComponent;
  let fixture: ComponentFixture<ContextoOrganizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextoOrganizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextoOrganizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosAnalisisDesviacionComponent } from './documentos-analisis-desviacion.component';

describe('DocumentosAnalisisDesviacionComponent', () => {
  let component: DocumentosAnalisisDesviacionComponent;
  let fixture: ComponentFixture<DocumentosAnalisisDesviacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosAnalisisDesviacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosAnalisisDesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

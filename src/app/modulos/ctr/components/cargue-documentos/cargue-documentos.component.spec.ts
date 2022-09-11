import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueDocumentosComponent } from './cargue-documentos.component';

describe('CargueDocumentosComponent', () => {
  let component: CargueDocumentosComponent;
  let fixture: ComponentFixture<CargueDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargueDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargueDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

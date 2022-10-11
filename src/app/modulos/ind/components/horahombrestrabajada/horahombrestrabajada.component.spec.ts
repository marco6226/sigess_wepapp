import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorahombrestrabajadaComponent } from './horahombrestrabajada.component';

describe('HorahombrestrabajadaComponent', () => {
  let component: HorahombrestrabajadaComponent;
  let fixture: ComponentFixture<HorahombrestrabajadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorahombrestrabajadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorahombrestrabajadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

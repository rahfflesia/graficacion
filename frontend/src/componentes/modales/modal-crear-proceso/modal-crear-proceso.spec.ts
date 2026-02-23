import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearProceso } from './modal-crear-proceso';

describe('ModalCrearProceso', () => {
  let component: ModalCrearProceso;
  let fixture: ComponentFixture<ModalCrearProceso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearProceso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearProceso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

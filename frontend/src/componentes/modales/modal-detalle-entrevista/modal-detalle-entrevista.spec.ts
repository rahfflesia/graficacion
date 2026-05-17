import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleEntrevista } from './modal-detalle-entrevista';

describe('ModalDetalleEntrevista', () => {
  let component: ModalDetalleEntrevista;
  let fixture: ComponentFixture<ModalDetalleEntrevista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleEntrevista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleEntrevista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

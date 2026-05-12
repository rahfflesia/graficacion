import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarSeguimientoTransaccional } from './modal-editar-seguimiento-transaccional';

describe('ModalEditarSeguimientoTransaccional', () => {
  let component: ModalEditarSeguimientoTransaccional;
  let fixture: ComponentFixture<ModalEditarSeguimientoTransaccional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarSeguimientoTransaccional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarSeguimientoTransaccional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarObservacion } from './modal-editar-observacion';

describe('ModalEditarObservacion', () => {
  let component: ModalEditarObservacion;
  let fixture: ComponentFixture<ModalEditarObservacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarObservacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarObservacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarParticipante } from './modal-agregar-participante';

describe('ModalAgregarParticipante', () => {
  let component: ModalAgregarParticipante;
  let fixture: ComponentFixture<ModalAgregarParticipante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarParticipante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarParticipante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

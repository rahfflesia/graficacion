import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarEntrevista } from './modal-editar-entrevista';

describe('ModalEditarEntrevista', () => {
  let component: ModalEditarEntrevista;
  let fixture: ComponentFixture<ModalEditarEntrevista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarEntrevista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarEntrevista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarProyecto } from './modal-editar-proyecto';

describe('ModalEditarProyecto', () => {
  let component: ModalEditarProyecto;
  let fixture: ComponentFixture<ModalEditarProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarProyecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarProyecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

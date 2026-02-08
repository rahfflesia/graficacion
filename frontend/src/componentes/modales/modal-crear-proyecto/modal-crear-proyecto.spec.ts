import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearProyecto } from './modal-crear-proyecto';

describe('ModalCrearProyecto', () => {
  let component: ModalCrearProyecto;
  let fixture: ComponentFixture<ModalCrearProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearProyecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearProyecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

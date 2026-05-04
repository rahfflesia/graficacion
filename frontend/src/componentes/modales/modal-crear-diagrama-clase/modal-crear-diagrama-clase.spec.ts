import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearDiagramaClase } from './modal-crear-diagrama-clase';

describe('ModalCrearDiagramaClase', () => {
  let component: ModalCrearDiagramaClase;
  let fixture: ComponentFixture<ModalCrearDiagramaClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearDiagramaClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearDiagramaClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

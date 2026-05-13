import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarDiagrama } from './modal-eliminar-diagrama';

describe('ModalEliminarDiagrama', () => {
  let component: ModalEliminarDiagrama;
  let fixture: ComponentFixture<ModalEliminarDiagrama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarDiagrama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarDiagrama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

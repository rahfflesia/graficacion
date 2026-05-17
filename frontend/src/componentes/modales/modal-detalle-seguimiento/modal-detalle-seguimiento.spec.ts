import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleSeguimiento } from './modal-detalle-seguimiento';

describe('ModalDetalleSeguimiento', () => {
  let component: ModalDetalleSeguimiento;
  let fixture: ComponentFixture<ModalDetalleSeguimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleSeguimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleSeguimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearDiagrama } from './modal-crear-diagrama';

describe('ModalCrearDiagrama', () => {
  let component: ModalCrearDiagrama;
  let fixture: ComponentFixture<ModalCrearDiagrama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearDiagrama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearDiagrama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

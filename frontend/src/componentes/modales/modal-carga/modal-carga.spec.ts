import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarga } from './modal-carga';

describe('ModalCarga', () => {
  let component: ModalCarga;
  let fixture: ComponentFixture<ModalCarga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCarga]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCarga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

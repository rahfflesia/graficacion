import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfiguracionProyecto } from './modal-configuracion-proyecto';

describe('ModalConfiguracionProyecto', () => {
  let component: ModalConfiguracionProyecto;
  let fixture: ComponentFixture<ModalConfiguracionProyecto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfiguracionProyecto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfiguracionProyecto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

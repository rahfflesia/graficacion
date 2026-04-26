import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionHistoriasUsuario } from './seccion-historias-usuario';

describe('SeccionHistoriasUsuario', () => {
  let component: SeccionHistoriasUsuario;
  let fixture: ComponentFixture<SeccionHistoriasUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionHistoriasUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionHistoriasUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

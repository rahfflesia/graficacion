import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionSeguimientoTransaccional } from './seccion-seguimiento-transaccional';

describe('SeccionSeguimientoTransaccional', () => {
  let component: SeccionSeguimientoTransaccional;
  let fixture: ComponentFixture<SeccionSeguimientoTransaccional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionSeguimientoTransaccional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionSeguimientoTransaccional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

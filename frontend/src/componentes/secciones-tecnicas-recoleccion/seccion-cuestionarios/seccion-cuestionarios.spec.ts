import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionCuestionarios } from './seccion-cuestionarios';

describe('SeccionCuestionarios', () => {
  let component: SeccionCuestionarios;
  let fixture: ComponentFixture<SeccionCuestionarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionCuestionarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionCuestionarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

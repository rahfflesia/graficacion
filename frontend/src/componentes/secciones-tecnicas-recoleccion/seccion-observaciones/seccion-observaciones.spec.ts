import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionObservaciones } from './seccion-observaciones';

describe('SeccionObservaciones', () => {
  let component: SeccionObservaciones;
  let fixture: ComponentFixture<SeccionObservaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionObservaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionObservaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

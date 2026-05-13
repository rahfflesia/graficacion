import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeCasoUso } from './shape-caso-uso';

describe('ShapeCasoUso', () => {
  let component: ShapeCasoUso;
  let fixture: ComponentFixture<ShapeCasoUso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeCasoUso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeCasoUso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

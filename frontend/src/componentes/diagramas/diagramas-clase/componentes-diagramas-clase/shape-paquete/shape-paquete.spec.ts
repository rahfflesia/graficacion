import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapePaquete } from './shape-paquete';

describe('ShapePaquete', () => {
  let component: ShapePaquete;
  let fixture: ComponentFixture<ShapePaquete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapePaquete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapePaquete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

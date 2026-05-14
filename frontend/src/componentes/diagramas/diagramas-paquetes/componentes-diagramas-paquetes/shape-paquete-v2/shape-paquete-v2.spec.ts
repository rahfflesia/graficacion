import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapePaqueteV2 } from './shape-paquete-v2';

describe('ShapePaqueteV2', () => {
  let component: ShapePaqueteV2;
  let fixture: ComponentFixture<ShapePaqueteV2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapePaqueteV2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapePaqueteV2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

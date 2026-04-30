import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeClase } from './shape-clase';

describe('ShapeClase', () => {
  let component: ShapeClase;
  let fixture: ComponentFixture<ShapeClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

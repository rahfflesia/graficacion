import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeInterfaz } from './shape-interfaz';

describe('ShapeInterfaz', () => {
  let component: ShapeInterfaz;
  let fixture: ComponentFixture<ShapeInterfaz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeInterfaz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeInterfaz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

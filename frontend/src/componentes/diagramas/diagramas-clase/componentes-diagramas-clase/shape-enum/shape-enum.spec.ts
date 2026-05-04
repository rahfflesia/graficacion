import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeEnum } from './shape-enum';

describe('ShapeEnum', () => {
  let component: ShapeEnum;
  let fixture: ComponentFixture<ShapeEnum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeEnum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeEnum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

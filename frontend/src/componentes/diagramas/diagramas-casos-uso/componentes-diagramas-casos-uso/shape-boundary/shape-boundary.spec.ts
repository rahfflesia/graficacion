import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeBoundary } from './shape-boundary';

describe('ShapeBoundary', () => {
  let component: ShapeBoundary;
  let fixture: ComponentFixture<ShapeBoundary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeBoundary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeBoundary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

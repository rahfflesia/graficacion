import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeLabel } from './shape-label';

describe('ShapeLabel', () => {
  let component: ShapeLabel;
  let fixture: ComponentFixture<ShapeLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

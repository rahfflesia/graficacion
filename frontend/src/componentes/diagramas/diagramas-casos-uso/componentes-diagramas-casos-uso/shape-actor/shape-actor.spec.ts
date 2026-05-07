import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeActor } from './shape-actor';

describe('ShapeActor', () => {
  let component: ShapeActor;
  let fixture: ComponentFixture<ShapeActor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeActor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeActor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

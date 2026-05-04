import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDiagramaClase } from './canvas-diagrama-clase';

describe('CanvasDiagramaClase', () => {
  let component: CanvasDiagramaClase;
  let fixture: ComponentFixture<CanvasDiagramaClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasDiagramaClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDiagramaClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

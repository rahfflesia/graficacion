import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDiagramaPaquetes } from './canvas-diagrama-paquetes';

describe('CanvasDiagramaPaquetes', () => {
  let component: CanvasDiagramaPaquetes;
  let fixture: ComponentFixture<CanvasDiagramaPaquetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasDiagramaPaquetes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDiagramaPaquetes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

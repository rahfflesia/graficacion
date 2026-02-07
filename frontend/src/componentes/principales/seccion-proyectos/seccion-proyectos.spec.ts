import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionProyectos } from './seccion-proyectos';

describe('SeccionProyectos', () => {
  let component: SeccionProyectos;
  let fixture: ComponentFixture<SeccionProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

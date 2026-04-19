import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderCuestionario } from './responder-cuestionario';

describe('ResponderCuestionario', () => {
  let component: ResponderCuestionario;
  let fixture: ComponentFixture<ResponderCuestionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderCuestionario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponderCuestionario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

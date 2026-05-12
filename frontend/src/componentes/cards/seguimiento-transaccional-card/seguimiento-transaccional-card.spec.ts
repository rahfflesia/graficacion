import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoTransaccionalCard } from './seguimiento-transaccional-card';

describe('SeguimientoTransaccionalCard', () => {
  let component: SeguimientoTransaccionalCard;
  let fixture: ComponentFixture<SeguimientoTransaccionalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoTransaccionalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoTransaccionalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoCard } from './proceso-card';

describe('ProcesoCard', () => {
  let component: ProcesoCard;
  let fixture: ComponentFixture<ProcesoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

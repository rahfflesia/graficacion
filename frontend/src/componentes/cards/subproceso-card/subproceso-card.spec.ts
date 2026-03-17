import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprocesoCard } from './subproceso-card';

describe('SubprocesoCard', () => {
  let component: SubprocesoCard;
  let fixture: ComponentFixture<SubprocesoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubprocesoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubprocesoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

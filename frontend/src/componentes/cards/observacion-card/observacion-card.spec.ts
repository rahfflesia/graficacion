import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionCard } from './observacion-card';

describe('ObservacionCard', () => {
  let component: ObservacionCard;
  let fixture: ComponentFixture<ObservacionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservacionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrevistaCard } from './entrevista-card';

describe('EntrevistaCard', () => {
  let component: EntrevistaCard;
  let fixture: ComponentFixture<EntrevistaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrevistaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrevistaCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

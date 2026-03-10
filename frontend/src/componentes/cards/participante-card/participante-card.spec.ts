import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteCard } from './participante-card';

describe('ParticipanteCard', () => {
  let component: ParticipanteCard;
  let fixture: ComponentFixture<ParticipanteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipanteCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipanteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

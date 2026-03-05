import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolCard } from './rol-card';

describe('RolCard', () => {
  let component: RolCard;
  let fixture: ComponentFixture<RolCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

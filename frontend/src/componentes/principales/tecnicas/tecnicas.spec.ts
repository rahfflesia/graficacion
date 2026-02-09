import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tecnicas } from './tecnicas';

describe('Tecnicas', () => {
  let component: Tecnicas;
  let fixture: ComponentFixture<Tecnicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tecnicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tecnicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

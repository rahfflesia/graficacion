import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionEntrevistas } from './seccion-entrevistas';

describe('SeccionEntrevistas', () => {
  let component: SeccionEntrevistas;
  let fixture: ComponentFixture<SeccionEntrevistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionEntrevistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionEntrevistas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

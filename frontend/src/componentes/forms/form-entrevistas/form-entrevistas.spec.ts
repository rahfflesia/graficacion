import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEntrevistas } from './form-entrevistas';

describe('FormEntrevistas', () => {
  let component: FormEntrevistas;
  let fixture: ComponentFixture<FormEntrevistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEntrevistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEntrevistas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

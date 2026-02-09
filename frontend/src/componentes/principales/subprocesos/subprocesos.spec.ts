import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subprocesos } from './subprocesos';

describe('Subprocesos', () => {
  let component: Subprocesos;
  let fixture: ComponentFixture<Subprocesos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subprocesos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subprocesos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

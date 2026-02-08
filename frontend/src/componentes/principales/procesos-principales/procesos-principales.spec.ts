import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosPrincipales } from './procesos-principales';

describe('ProcesosPrincipales', () => {
  let component: ProcesosPrincipales;
  let fixture: ComponentFixture<ProcesosPrincipales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesosPrincipales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesosPrincipales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

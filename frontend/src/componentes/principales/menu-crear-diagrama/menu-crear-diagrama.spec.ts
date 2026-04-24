import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCrearDiagrama } from './menu-crear-diagrama';

describe('MenuCrearDiagrama', () => {
  let component: MenuCrearDiagrama;
  let fixture: ComponentFixture<MenuCrearDiagrama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCrearDiagrama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCrearDiagrama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

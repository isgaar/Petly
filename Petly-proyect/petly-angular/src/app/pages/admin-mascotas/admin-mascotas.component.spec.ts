import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMascotasComponent } from './admin-mascotas.component';

describe('AdminMascotasComponent', () => {
  let component: AdminMascotasComponent;
  let fixture: ComponentFixture<AdminMascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMascotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

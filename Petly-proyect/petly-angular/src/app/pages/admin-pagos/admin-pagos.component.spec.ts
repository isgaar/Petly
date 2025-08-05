import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPagosComponent } from './admin-pagos.component';

describe('AdminPagosComponent', () => {
  let component: AdminPagosComponent;
  let fixture: ComponentFixture<AdminPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

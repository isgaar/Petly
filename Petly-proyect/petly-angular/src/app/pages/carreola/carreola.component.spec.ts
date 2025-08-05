import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreolaComponent } from './carreola.component';

describe('CarreolaComponent', () => {
  let component: CarreolaComponent;
  let fixture: ComponentFixture<CarreolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarreolaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarreolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

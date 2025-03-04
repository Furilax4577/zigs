import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HassConfigStepComponent } from './hass-config-step.component';

describe('HassConfigStepComponent', () => {
  let component: HassConfigStepComponent;
  let fixture: ComponentFixture<HassConfigStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HassConfigStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HassConfigStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZendureMqttStepComponent } from './zendure-mqtt-step.component';

describe('ZendureMqttStepComponent', () => {
  let component: ZendureMqttStepComponent;
  let fixture: ComponentFixture<ZendureMqttStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZendureMqttStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZendureMqttStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

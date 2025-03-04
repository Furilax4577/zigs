import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZendureApiStepComponent } from './zendure-api-step.component';

describe('ZendureApiStepComponent', () => {
  let component: ZendureApiStepComponent;
  let fixture: ComponentFixture<ZendureApiStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZendureApiStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZendureApiStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

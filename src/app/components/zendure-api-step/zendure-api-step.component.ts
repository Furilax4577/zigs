import { ZendureApiService } from './../../services/zendure-api.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-zendure-api-step',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './zendure-api-step.component.html',
  styleUrl: './zendure-api-step.component.scss',
})
export class ZendureApiStepComponent {
  @Input({ required: true }) zendureForm!: FormGroup;
  @Output() nextStep = new EventEmitter<void>();

  isLoading = false;

  constructor(private zendureApiService: ZendureApiService) {}

  connexion() {
    if (this.zendureForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.zendureApiService
      .getMqttCredentials({
        account: this.zendureForm.get('account')?.value,
        snNumber: this.zendureForm.get('snNumber')?.value,
      })
      .subscribe((res) => {
        if (res.success) {
          this.nextStep.emit();
        } else {
        }
        this.isLoading = false;
      });
  }
}

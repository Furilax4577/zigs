import { ZendureApiService } from './../../services/zendure-api.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZendureApiResponse } from '../../interfaces';

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
  @Input({ required: true }) zendureApiForm!: FormGroup;
  @Output() nextStep = new EventEmitter<ZendureApiResponse>();

  isLoading = false;

  constructor(private zendureApiService: ZendureApiService) {}

  connexion() {
    if (this.zendureApiForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.zendureApiService
      .getMqttCredentials({
        account: this.zendureApiForm.get('account')?.value,
        snNumber: this.zendureApiForm.get('snNumber')?.value,
      })
      .subscribe((res) => {
        if (res.success) {
          this.nextStep.emit(res);
        }
        this.isLoading = false;
      });
  }
}

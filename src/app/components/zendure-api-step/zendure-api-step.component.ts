import { ZendureApiService } from './../../services/zendure-api.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZendureApiResponse } from '../../interfaces';

@Component({
  selector: 'app-zendure-api-step',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './zendure-api-step.component.html',
  styleUrl: './zendure-api-step.component.scss',
})
export class ZendureApiStepComponent {
  @Input({ required: true }) zendureApiForm!: FormGroup;
  @Output() nextStep = new EventEmitter<ZendureApiResponse>();

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private zendureApiService: ZendureApiService) {}

  connexion() {
    if (this.zendureApiForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.zendureApiService
      .getMqttCredentials({
        account: this.zendureApiForm.get('account')?.value,
        snNumber: this.zendureApiForm.get('snNumber')?.value,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.nextStep.emit(res);
          }
        },
        error: (res) => {
          console.log(res);
          this.errorMessage = res.error.message;
        },
      })
      .add(() => {
        this.isLoading = false;
      });
  }
}

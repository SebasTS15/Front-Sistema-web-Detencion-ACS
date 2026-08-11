import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApneaApiService } from '../../services/apnea-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApneaApiService);
  private readonly router = inject(Router);

  isSubmitting = false;
  loginMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberSession: [true]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginMessage = '';

    this.api.login({
      username: this.form.controls.username.value,
      password: this.form.controls.password.value
    }, this.form.controls.rememberSession.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/cargar-registro');
      },
      error: () => {
        this.isSubmitting = false;
        this.loginMessage = 'No fue posible iniciar sesión. Revisa tus credenciales o endpoint.';
      }
    });
  }
}

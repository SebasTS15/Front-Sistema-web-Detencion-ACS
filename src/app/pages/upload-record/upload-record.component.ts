import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApneaApiService } from '../../services/apnea-api.service';

@Component({
  selector: 'app-upload-record',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './upload-record.component.html',
  styleUrl: './upload-record.component.scss'
})
export class UploadRecordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApneaApiService);
  private readonly router = inject(Router);

  selectedFile: File | null = null;
  dragActive = false;
  isUploading = false;
  uploadMessage = '';

  readonly form = this.fb.nonNullable.group({
    patientName: ['', [Validators.required, Validators.minLength(3)]],
    patientId: ['', Validators.required],
    notes: ['']
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.assignFile(input.files?.[0] ?? null);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive = false;
    this.assignFile(event.dataTransfer?.files?.[0] ?? null);
  }

  assignFile(file: File | null): void {
    this.selectedFile = file;
    this.uploadMessage = file ? '' : 'Selecciona un archivo médico válido.';
  }

  submit(): void {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      this.uploadMessage = !this.selectedFile ? 'Debes cargar un archivo antes de enviar.' : '';
      return;
    }

    this.isUploading = true;
    this.uploadMessage = '';

    this.api.uploadMedicalRecord({
      patientName: this.form.controls.patientName.value,
      patientId: this.form.controls.patientId.value,
      notes: this.form.controls.notes.value,
      file: this.selectedFile
    }).subscribe({
      next: () => {
        this.isUploading = false;
        this.router.navigateByUrl('/resultados');
      },
      error: () => {
        this.isUploading = false;
        this.uploadMessage = 'No fue posible enviar el archivo. Revisa la conexión con tu backend.';
      }
    });
  }
}

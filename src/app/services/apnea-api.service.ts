import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApneaResult, LoginRequest, UploadMedicalRecordRequest } from '../models/medical-record.model';

const API_BASE_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApneaApiService {
  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<{ token: string; name: string }> {
    // Cambia esta línea por tu endpoint real cuando conectes el backend.
    // return this.http.post<{ token: string; name: string }>(`${API_BASE_URL}/auth/login`, credentials);
    return of({ token: 'mock-token', name: credentials.email.split('@')[0] || 'Usuario' });
  }

  uploadMedicalRecord(payload: UploadMedicalRecordRequest): Observable<ApneaResult> {
    const formData = new FormData();
    formData.append('patientName', payload.patientName);
    formData.append('patientId', payload.patientId);
    formData.append('notes', payload.notes ?? '');
    formData.append('file', payload.file, payload.file.name);

    // Cambia esta línea por tu endpoint real cuando conectes el backend.
    // return this.http.post<ApneaResult>(`${API_BASE_URL}/medical-records/analyze`, formData);
    return of(mockResults[0]);
  }

  getResults(query = ''): Observable<ApneaResult[]> {
    // Cambia esta línea por tu endpoint real cuando conectes el backend.
    // return this.http.get<ApneaResult[]>(`${API_BASE_URL}/results`, { params: { q: query } });
    const normalizedQuery = query.trim().toLowerCase();
    return of(
      normalizedQuery
        ? mockResults.filter((result) =>
            `${result.patientName} ${result.patientId} ${result.prediction}`.toLowerCase().includes(normalizedQuery)
          )
        : mockResults
    );
  }
}

export const mockResults: ApneaResult[] = [
  {
    id: 'AC-2026-001',
    patientName: 'Paciente de ejemplo',
    patientId: 'MED-1024',
    uploadedAt: '2026-08-11T09:30:00.000Z',
    status: 'completed',
    prediction: 'Apnea Central',
    riskLevel: 'Alto',
    confidence: 93,
    recommendations: [
      'Consultar con especialista en medicina del sueño.',
      'Revisar eventos de desaturación nocturna.',
      'Mantener seguimiento de frecuencia cardiaca y flujo respiratorio.'
    ],
    signals: {
      respiratoryFlow: [23, 25, 21, 11, 9, 19, 24, 22, 10, 8, 20, 24],
      spo2: [96, 95, 94, 91, 88, 90, 93, 95, 92, 89, 94, 96],
      heartRate: [72, 73, 75, 88, 91, 82, 76, 74, 86, 90, 78, 73]
    }
  },
  {
    id: 'AC-2026-002',
    patientName: 'Registro control',
    patientId: 'MED-2048',
    uploadedAt: '2026-08-10T18:10:00.000Z',
    status: 'completed',
    prediction: 'No detectada',
    riskLevel: 'Bajo',
    confidence: 87,
    recommendations: [
      'No se observan patrones compatibles en el registro cargado.',
      'Continuar monitoreo si persisten síntomas.'
    ],
    signals: {
      respiratoryFlow: [22, 23, 23, 24, 23, 22, 24, 23, 22, 23, 24, 23],
      spo2: [97, 97, 96, 97, 98, 97, 96, 97, 97, 98, 97, 97],
      heartRate: [68, 69, 70, 69, 68, 70, 69, 68, 69, 70, 69, 68]
    }
  }
];

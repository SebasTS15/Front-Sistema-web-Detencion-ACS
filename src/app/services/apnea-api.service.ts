import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApneaResult, LoginRequest, UploadMedicalRecordRequest } from '../models/medical-record.model';

// Replace this host with the public URL assigned to the production API.
const API_BASE_URL = 'https://backend-sistema-web-detencion-acs.onrender.com/api/v1';
const ACCESS_TOKEN_KEY = 'apnea-care.access-token';
const LAST_RESULT_KEY = 'apnea-care.last-result';

interface TokenResponse { access_token: string; token_type: string; }
interface PredictResponse { prediccion: boolean; probabilidad: number; clase: string; resultado_id: number | null; }
interface ApiResult { id: number; paciente_id: string | null; prediccion: boolean; probabilidad: number; clase: string; created_at: string; }

@Injectable({ providedIn: 'root' })
export class ApneaApiService {
  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest, rememberSession: boolean): Observable<void> {
    return this.http.post<TokenResponse>(`${API_BASE_URL}/auth/token`, credentials).pipe(
      tap(({ access_token }) => this.tokenStorage(rememberSession).setItem(ACCESS_TOKEN_KEY, access_token)),
      map(() => undefined)
    );
  }

  uploadMedicalRecord(payload: UploadMedicalRecordRequest): Observable<ApneaResult> {
    const formData = new FormData();
    formData.append('archivo', payload.file, payload.file.name);
    formData.append('paciente_id', payload.patientId);
    formData.append('metadata', JSON.stringify({ patient_name: payload.patientName, notes: payload.notes ?? '' }));
    formData.append('normalize', 'true');
    formData.append('guardar_resultado', 'true');
    formData.append('guardar_historial', 'true');

    return this.http.post<PredictResponse>(`${API_BASE_URL}/predict`, formData, { headers: this.authHeaders() }).pipe(
      map((response) => this.mapPrediction(response, payload)),
      tap((result) => localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result)))
    );
  }

  getResults(query = ''): Observable<ApneaResult[]> {
    const normalizedQuery = query.trim().toLowerCase();
    const lastResult = this.getLastResult();
    return new Observable<ApneaResult[]>((subscriber) => {
      subscriber.next(this.filterResults(lastResult ? [lastResult] : [], normalizedQuery));
      subscriber.complete();
    });
  }

  getResultsForUser(userId: number, query = ''): Observable<ApneaResult[]> {
    const normalizedQuery = query.trim().toLowerCase();
    return this.http.get<ApiResult[]>(`${API_BASE_URL}/usuarios/${userId}/resultados`, { headers: this.authHeaders() }).pipe(
      map((results) => results.map((result) => this.mapStoredResult(result))),
      map((results) => this.filterResults(results, normalizedQuery))
    );
  }

  private mapPrediction(response: PredictResponse, payload: UploadMedicalRecordRequest): ApneaResult {
    return this.toApneaResult({ id: response.resultado_id ?? `local-${Date.now()}`, patientId: payload.patientId, patientName: payload.patientName, prediction: response.prediccion, probability: response.probabilidad, uploadedAt: new Date().toISOString() });
  }

  private mapStoredResult(result: ApiResult): ApneaResult {
    return this.toApneaResult({ id: result.id, patientId: result.paciente_id ?? 'Sin identificacion', patientName: `Paciente ${result.paciente_id ?? result.id}`, prediction: result.prediccion, probability: result.probabilidad, uploadedAt: result.created_at });
  }

  private toApneaResult(data: { id: string | number; patientId: string; patientName: string; prediction: boolean; probability: number; uploadedAt: string }): ApneaResult {
    return {
      id: String(data.id), patientName: data.patientName, patientId: data.patientId, uploadedAt: data.uploadedAt,
      status: 'completed', prediction: data.prediction ? 'Apnea Central' : 'No detectada', riskLevel: data.prediction ? 'Alto' : 'Bajo', confidence: Math.round(data.probability * 100),
      recommendations: data.prediction
        ? ['Se detectaron patrones compatibles con apnea central.', 'Consultar con un especialista en medicina del sueno.']
        : ['No se detectaron patrones compatibles con apnea central en este registro.'],
      signals: { respiratoryFlow: [], spo2: [], heartRate: [] }
    };
  }

  private filterResults(results: ApneaResult[], query: string): ApneaResult[] {
    return query ? results.filter((result) => `${result.patientName} ${result.patientId} ${result.prediction}`.toLowerCase().includes(query)) : results;
  }

  private getLastResult(): ApneaResult | null {
    try {
      const value = localStorage.getItem(LAST_RESULT_KEY);
      return value ? JSON.parse(value) as ApneaResult : null;
    } catch {
      return null;
    }
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private tokenStorage(rememberSession: boolean): Storage {
    const otherStorage = rememberSession ? sessionStorage : localStorage;
    otherStorage.removeItem(ACCESS_TOKEN_KEY);
    return rememberSession ? localStorage : sessionStorage;
  }
}

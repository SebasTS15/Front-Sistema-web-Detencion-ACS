export interface LoginRequest {
  email: string;
  password: string;
}

export interface UploadMedicalRecordRequest {
  patientName: string;
  patientId: string;
  notes?: string;
  file: File;
}

export interface ApneaResult {
  id: string;
  patientName: string;
  patientId: string;
  uploadedAt: string;
  status: 'completed' | 'processing' | 'failed';
  prediction: 'Apnea Central' | 'No detectada' | 'Pendiente';
  riskLevel: 'Alto' | 'Medio' | 'Bajo' | 'Pendiente';
  confidence: number;
  recommendations: string[];
  signals: {
    respiratoryFlow: number[];
    spo2: number[];
    heartRate: number[];
  };
}

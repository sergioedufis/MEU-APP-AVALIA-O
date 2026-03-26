
export interface Student {
  id: string;
  name: string;
  birthDate: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  lastEvaluation?: string;
  photoUrl?: string;
}

export interface Anamnesis {
  parq: boolean;
  injuries: string[];
  medications: string[];
  painScale: number;
  sleepQuality: 'Péssimo' | 'Regular' | 'Bom' | 'Excelente';
  stressLevel: number;
  alcohol: boolean;
  smoking: boolean;
  goals: string[];
  experience: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface Vitals {
  systolic: number;
  diastolic: number;
  heartRate: number;
  oximetry: number;
}

export interface Anthropometry {
  weight: number;
  height: number;
  waist: number;
  abdomen: number;
  hip: number;
  neck: number;
  armRight: number;
  armLeft: number;
  thighRight: number;
  thighLeft: number;
  calfRight: number;
  calfLeft: number;
}

export interface Skinfolds {
  protocol: 3 | 7 | 9;
  chest: number;
  midaxillary: number;
  triceps: number;
  subscapular: number;
  abdominal: number;
  suprailiac: number;
  thigh: number;
  calf: number;
  biceps: number;
}

export interface Dynamometry {
  handRight: number;
  handLeft: number;
  extensorRight: number;
  extensorLeft: number;
  flexorRight: number;
  flexorLeft: number;
  bicepsRight: number;
  bicepsLeft: number;
  tricepsRight: number;
  tricepsLeft: number;
}

export interface Evaluation {
  id: string;
  studentId: string;
  date: string;
  anamnesis: Anamnesis;
  vitals: Vitals;
  anthropometry: Anthropometry;
  skinfolds: Skinfolds;
  dynamometry: Dynamometry;
  cooperDistance: number;
  flexibility: number;
  photos: {
    front: string;
    back: string;
    right: string;
    left: string;
  };
  analysisText?: string;
}

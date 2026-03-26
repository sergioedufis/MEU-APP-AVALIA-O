
import React from 'react';
import { 
  UserPlus, 
  Scan, 
  Layout,
  Ruler,
  Layers,
  Trophy,
  Dna,
  Activity,
  BarChart3,
  ClipboardCheck,
  TrendingUp
} from 'lucide-react';

export const COLORS = {
  neon: '#39FF14',
  neonMedium: '#18B26A',
  dark: '#0A0A0A',
  metallic: '#C9C9C9',
  white: '#FFFFFF',
};

export const OWNER_INFO = {
  name: 'Sérgio Araujo',
  cref: 'CREF 007412-G/CE',
  appTitle: 'Performance 360',
  tagline: 'Avaliação Física Inteligente',
};

export const MENU_ITEMS = [
  { id: 'setup', label: 'Cadastro', icon: <UserPlus size={20} /> },
  { id: 'anamnese', label: 'Anamnese', icon: <ClipboardCheck size={20} /> },
  { id: 'perimetry', label: 'Perimetria', icon: <Ruler size={20} /> },
  { id: 'skinfolds', label: 'Dobras Cutâneas', icon: <Layers size={20} /> },
  { id: 'bio', label: 'Bioimpedância', icon: <Activity size={20} /> },
  { id: 'dinamometria', label: 'Dinamometria', icon: <Activity size={20} /> },
  { id: 'posture', label: 'Bio-Postura 360', icon: <Scan size={20} /> },
  { id: 'cardio', label: 'Cardio / VO2', icon: <Activity size={20} /> },
  { id: 'flexibility', label: 'Flexibilidade', icon: <Activity size={20} /> },
  { id: 'treino', label: 'Gerar Treino', icon: <Activity size={20} /> },
  { id: 'nutricao', label: 'Nutrição', icon: <Activity size={20} /> },
  { id: 'dashboard', label: 'DASHBOARD 360', icon: <BarChart3 size={20} /> },
  { id: 'comparativos', label: 'Comparativos', icon: <TrendingUp size={20} /> },
  { id: 'relatorio', label: '📄 RELATÓRIO GERAL', icon: <ClipboardCheck size={20} /> },
  { id: 'monetizacao', label: 'Monetização', icon: <TrendingUp size={20} /> },
  { id: 'configuracoes', label: 'Configurações', icon: <Layout size={20} /> },
  { id: 'admin', label: 'Painel Admin', icon: <UserPlus size={20} /> }
];

export const OBJECTIVES = [
  'Hipertrofia',
  'Reabilitação',
  'Emagrecimento',
  'Alta Performance',
  'Outros'
];

export const ANAMNESIS_OPTIONS = [
  'Dor Articular',
  'Lesão Pregressa',
  'Sedentarismo',
  'Uso de Medicamentos',
  'Histórico Cardíaco',
  'Tabagismo/Álcool',
  'Estresse Elevado',
  'Sono Irregular'
];


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Scan, 
  ShieldCheck,
  ClipboardCheck,
  Loader2,
  ChevronDown,
  Info,
  Maximize2,
  Columns,
  Layers,
  Activity,
  Award,
  ArrowRight,
  TrendingUp,
  History,
  Download,
  ImageIcon,
  Stethoscope,
  Target,
  Dna,
  Thermometer,
  ShieldAlert,
  FileText,
  Camera,
  User,
  Layout,
  Ruler,
  BarChart2,
  Trophy,
  Settings2,
  Calculator,
  PieChart,
  Target as TargetIcon,
  Flame,
  Scale,
  Atom,
  ChevronUp,
  Droplets,
  Zap as Energy,
  Clock,
  Heart,
  LayoutDashboard,
  BrainCircuit,
  ZapOff,
  FileDown,
  Zap as Power,
  Coffee,
  Utensils,
  Dna as BioIcon,
  TrendingDown,
  UserPlus,
  Trash2,
  Calendar,
  Save,
  Edit,
  X,
  Lock,
  Crown,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  HardDrive,
  Menu,
  HelpCircle,
  Dumbbell,
  Apple
} from 'lucide-react';
import Markdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  Pie,
  PieChart as RePieChart,
  LineChart,
  Line
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { OWNER_INFO, MENU_ITEMS, OBJECTIVES, ANAMNESIS_OPTIONS } from './constants';
import SomatotypeChart from './components/SomatotypeChart';
import PhotoAnalysis from './components/PhotoAnalysis';
import ComparisonsDashboard from './components/ComparisonsDashboard';
import AnamnesisDashboard from './components/AnamnesisDashboard';
import { BodyHeatmap } from './components/BodyHeatmap';
import { SkinfoldBodyMap } from './components/SkinfoldBodyMap';
import { MasterDashboard } from './components/MasterDashboard';
import { WeightGoalsPanel } from './components/WeightGoalsPanel';
import { IntelligentReport } from './components/IntelligentReport';
import { Calendar as CalendarComponent } from './components/Calendar';
import { CardioTests } from './components/CardioTests';
import { FlexibilityTests } from './components/FlexibilityTests';
import { generateProfessionalAnalysis, analyzeMedicalDocuments, generatePerimetryAnalysis, generateDynamometryAnalysis } from './services/geminiService';
import { supabase } from './supabase';
import { Auth } from './components/Auth';
import { AdminPanel } from './components/AdminPanel';
import { Settings } from './components/Settings';
import { VoiceInputButton } from './components/VoiceInputButton';
import WorkoutGenerator from './components/WorkoutGenerator';
import NutritionGenerator from './components/NutritionGenerator';
import { PrintableMasterReport } from './components/PrintableMasterReport';
import { Glossary } from './components/GlossaryComponent';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const getIdealRange = (metric: string, gender: string): [number, number] => {
  const isMale = gender === 'M';
  switch (metric) {
    case 'bodyFat': return isMale ? [10, 15] : [18, 24];
    case 'muscleRate': return isMale ? [40, 50] : [30, 40];
    case 'visceralFat': return [1, 9];
    case 'bodyWater': return isMale ? [50, 65] : [45, 60];
    case 'boneMass': return isMale ? [2.5, 4.0] : [2.0, 3.0];
    case 'protein': return [16, 20];
    case 'bmr': return isMale ? [1500, 2000] : [1200, 1600];
    case 'neck': return isMale ? [38, 42] : [30, 34];
    case 'shoulder': return isMale ? [115, 130] : [95, 110];
    case 'thorax': return isMale ? [100, 115] : [85, 95];
    case 'waist': return isMale ? [75, 85] : [60, 70];
    case 'abdomen': return isMale ? [80, 90] : [65, 75];
    case 'hip': return isMale ? [95, 105] : [90, 100];
    case 'armRelaxedR': case 'armRelaxedL': return isMale ? [35, 40] : [25, 30];
    case 'forearmR': case 'forearmL': return isMale ? [28, 32] : [22, 26];
    case 'thighMedialR': case 'thighMedialL': return isMale ? [55, 65] : [50, 60];
    case 'calfR': case 'calfL': return isMale ? [38, 42] : [34, 38];
    case 'triceps': return isMale ? [8, 12] : [12, 18];
    case 'subscapular': return isMale ? [10, 15] : [12, 18];
    case 'abdominal': return isMale ? [12, 20] : [15, 25];
    case 'suprailiac': return isMale ? [10, 15] : [12, 20];
    case 'thigh': return isMale ? [10, 15] : [15, 25];
    default: return [0, 100];
  }
};

const getMinMax = (metric: string): [number, number] => {
  switch (metric) {
    case 'bodyFat': return [0, 50];
    case 'muscleRate': return [10, 80];
    case 'visceralFat': return [1, 30];
    case 'bodyWater': return [30, 80];
    case 'boneMass': return [1, 6];
    case 'protein': return [10, 30];
    case 'bmr': return [800, 3000];
    case 'neck': return [20, 60];
    case 'shoulder': return [80, 160];
    case 'thorax': return [70, 140];
    case 'waist': return [50, 120];
    case 'abdomen': return [50, 130];
    case 'hip': return [70, 140];
    case 'armRelaxedR': case 'armRelaxedL': return [20, 60];
    case 'forearmR': case 'forearmL': return [15, 45];
    case 'thighMedialR': case 'thighMedialL': return [30, 80];
    case 'calfR': case 'calfL': return [20, 60];
    case 'triceps': case 'subscapular': case 'abdominal': case 'suprailiac': case 'thigh': return [2, 50];
    default: return [0, 100];
  }
};

const ReferenceRuler = ({ value, min, max, idealRange, unit }: { value: number, min: number, max: number, idealRange: [number, number], unit: string }) => {
  const percentage = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const idealStart = clamp(((idealRange[0] - min) / (max - min)) * 100, 0, 100);
  const idealWidth = clamp(((idealRange[1] - idealRange[0]) / (max - min)) * 100, 0, 100);
  
  const isIdeal = value >= idealRange[0] && value <= idealRange[1];
  const color = isIdeal ? 'bg-neon' : (value < idealRange[0] ? 'bg-blue-400' : 'bg-red-500');

  return (
    <div className="mt-4 w-full animate-in fade-in duration-500">
      <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">
        <span>{min}{unit}</span>
        <span className="text-white">Ideal: {idealRange[0]}-{idealRange[1]}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="absolute top-0 bottom-0 bg-white/10" style={{ left: `${idealStart}%`, width: `${idealWidth}%` }} />
        <div className={`absolute top-0 bottom-0 ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

type StudentRecord = {
  id: string;
  name: string;
  email?: string;
  birthDate: string;
  sex: string;
  objective: string;
  anamnesis: string[];
  createdAt: string;
  parQAnswers: boolean[];
  workoutPlans?: any[];
  nutritionPlans?: any[];
  photoUrl?: string;
};

type EvaluationRecord = {
  id: string;
  studentId: string;
  date: string;
  weight: string;
  height: string;
  bio: any;
  perimetry: any;
  dynamometry: any;
  folds: any;
  posturalAnalysisResult: string | null;
  uploadedPhotos: any;
  oximetry?: string;
  bloodPressure?: string;
  anamnesisData?: any;
  cardioTest?: any;
  flexibilityTest?: any;
};

type ScheduleRecord = {
  id: string;
  studentId: string;
  date: string;
  notes: string;
};

const StudentPaywall: React.FC<{ onSubscribe: () => void, onBypass: () => void }> = ({ onSubscribe, onBypass }) => (
  <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
    <div className="glass-card max-w-lg p-12 rounded-[40px] text-center space-y-8 border-neon/20">
      <div className="w-24 h-24 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        <Lock className="text-neon" size={48} />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-widest text-white">Acesso aos Resultados</h2>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">
        Tenha acesso completo às suas avaliações físicas, histórico de evolução, laudos inteligentes e agendamentos por 3 meses.
      </p>
      
      <div className="bg-dark/50 p-6 rounded-3xl border border-white/5">
        <span className="text-4xl font-black text-white">R$ 300</span>
        <span className="text-sm text-gray-500 block mt-1">/trimestre</span>
      </div>

      <div className="pt-4">
        <button 
          onClick={onSubscribe}
          className="w-full px-8 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-neon flex items-center justify-center gap-3"
        >
          Pagar com Pix
        </button>
      </div>
      <button onClick={onBypass} className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-4">
        [Dev Mode] Pular Pagamento
      </button>
    </div>
  </div>
);

const TrainerPaywall: React.FC<{ onSubscribe: () => void, onBypass: () => void }> = ({ onSubscribe, onBypass }) => (
  <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
    <div className="glass-card max-w-lg p-12 rounded-[40px] text-center space-y-8 border-blue-500/20">
      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <Crown className="text-blue-500" size={48} />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-widest text-white">Assinatura Personal</h2>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">
        Gerencie seus alunos, crie avaliações, prescreva treinos e dietas com inteligência artificial.
      </p>

      <div className="bg-dark/50 p-6 rounded-3xl border border-white/5">
        <span className="text-4xl font-black text-white">R$ 50</span>
        <span className="text-sm text-gray-500 block mt-1">/mês</span>
      </div>

      <div className="pt-4">
        <button 
          onClick={onSubscribe}
          className="w-full px-8 py-5 bg-blue-500 text-white font-black rounded-3xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3"
        >
          Assinar Agora
        </button>
      </div>
      <button onClick={onBypass} className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-4">
        [Dev Mode] Pular Pagamento
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const trainerName = profile?.role === 'student' 
    ? (profile?.trainer_info?.full_name || 'Profissional Responsável')
    : (profile?.full_name || 'Profissional Responsável');
    
  const trainerCref = profile?.role === 'student'
    ? (profile?.trainer_info?.cref || 'CREF Não Informado')
    : (profile?.cref || 'CREF Não Informado');
    
  const trainerTitle = profile?.role === 'student'
    ? (profile?.trainer_info?.professional_title || 'Personal Trainer')
    : (profile?.professional_title || 'Personal Trainer');
    
  const trainerLogo = profile?.role === 'student'
    ? profile?.trainer_info?.logo_url
    : profile?.logo_url;
  const [activeTab, setActiveTab] = useState('setup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [posturalAnalysisResult, setPosturalAnalysisResult] = useState<string | null>(null);
  const [docAnalysisResult, setDocAnalysisResult] = useState<string | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [bypassedPaywall, setBypassedPaywall] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // --- DATABASE STATE ---
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'avaliador' | 'aluno'>('avaliador');
  const [showBioHelp, setShowBioHelp] = useState(false);
  const [showSkinfoldsHelp, setShowSkinfoldsHelp] = useState(false);
  const [showPerimetryHelp, setShowPerimetryHelp] = useState(false);
  const [showDynamometryHelp, setShowDynamometryHelp] = useState(false);
  const [showPostureHelp, setShowPostureHelp] = useState(false);

  const [mpToken, setMpToken] = useState('');
  const [isSavingMpToken, setIsSavingMpToken] = useState(false);

  useEffect(() => {
    if (profile?.stripe_account_id) {
      setMpToken(profile.stripe_account_id);
    }
  }, [profile?.stripe_account_id]);

  const handleSaveMpToken = async () => {
    if (!session?.user?.id) return;
    setIsSavingMpToken(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ stripe_account_id: mpToken })
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, stripe_account_id: mpToken } : null);
      alert('Token do Mercado Pago salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar token:', err);
      alert('Erro ao salvar token do Mercado Pago.');
    } finally {
      setIsSavingMpToken(false);
    }
  };

  const handleSubscribe = async () => {
    if (!session?.user?.id || !profile) return;
    setIsSubscribing(true);
    try {
      let trainerStripeAccountId = null;
      
      if (profile.role === 'student' && profile.trainer_id) {
        const { data: trainerProfile } = await supabase
          .from('profiles')
          .select('stripe_account_id')
          .eq('id', profile.trainer_id)
          .single();
          
        if (trainerProfile?.stripe_account_id) {
          trainerStripeAccountId = trainerProfile.stripe_account_id;
        } else {
          alert("Seu personal trainer ainda não configurou os pagamentos no Mercado Pago.");
          setIsSubscribing(false);
          return;
        }
      }

      const endpoint = profile.role === 'student' ? '/api/checkout/student' : '/api/checkout/trainer';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          trainerId: profile.trainer_id,
          trainerStripeAccountId,
          priceId: profile.role === 'student' ? 'price_student_placeholder' : 'price_trainer_placeholder'
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar pagamento: " + (data.error || "Desconhecido"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao iniciar pagamento.");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id, session);
      else setProfile(null);
    });

    const s = localStorage.getItem('perf360_students');
    const e = localStorage.getItem('perf360_evaluations');
    const sch = localStorage.getItem('perf360_schedules');
    if (s) setStudents(JSON.parse(s));
    if (e) setEvaluations(JSON.parse(e));
    if (sch) setSchedules(JSON.parse(sch));

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, currentSession?: any) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
      if (data.role === 'student' && data.trainer_id) {
        const { data: trainerData } = await supabase
          .from('profiles')
          .select('full_name, cref, logo_url, professional_title')
          .eq('id', data.trainer_id)
          .single();
        if (trainerData) {
          data.trainer_info = trainerData;
        }
      }
      setProfile(data);
      if (data.role === 'student') {
        setViewMode('aluno');
        setActiveTab('dashboard');
      }
      loadAppState(userId, data.role);
    } else if (error && error.code === 'PGRST116') {
      // Profile not found, create it
      const userEmail = currentSession?.user?.email || session?.user?.email || '';
      const userFullName = currentSession?.user?.user_metadata?.full_name || session?.user?.user_metadata?.full_name || '';
      const newProfile = {
        id: userId,
        email: userEmail,
        full_name: userFullName,
        role: userEmail === 'edufissergio@gmail.com' ? 'admin' : 'pending'
      };
      const { error: insertError } = await supabase.from('profiles').insert(newProfile);
      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        setProfile(newProfile);
        loadAppState(userId, newProfile.role);
      }
    } else if (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSync = async () => {
    if (!session?.user?.id || !profile) return;
    setIsSyncing(true);
    try {
      await loadAppState(session.user.id, profile.role);
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (!session?.user?.id || !profile) return;
    setIsSyncing(true);
    try {
      localStorage.removeItem('perf360_students');
      localStorage.removeItem('perf360_evaluations');
      localStorage.removeItem('perf360_schedules');
      setStudents([]);
      setEvaluations([]);
      setSchedules([]);
      await loadAppState(session.user.id, profile.role);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadAppState = async (userId: string, role: string) => {
    if (role === 'student') {
      const { data: sData } = await supabase.from('students').select('*').eq('user_id', userId);
      const { data: eData } = await supabase.from('evaluations').select('*');
      const { data: schData } = await supabase.from('schedules').select('*');
      
      let mappedStudents: any[] = [];
      let mappedEvals: any[] = [];

      if (sData) {
        mappedStudents = sData.map(s => s.data);
        setStudents(mappedStudents);
      }
      if (eData) {
        mappedEvals = eData.map(e => e.data);
        setEvaluations(mappedEvals);
      }
      if (schData) setSchedules(schData.map(sch => sch.data));

      if (mappedStudents.length > 0) {
        const student = mappedStudents[0];
        setSelectedStudentId(student.id);
        const studentEvals = mappedEvals.filter(e => e.studentId === student.id);
        if (studentEvals.length > 0) {
          const latest = studentEvals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          setFormData({
            ...formData,
            name: student.name,
            birthDate: student.birthDate,
            sex: student.sex,
            objective: student.objective,
            anamnesis: student.anamnesis,
            parQAnswers: (student as any).parQAnswers || Array(7).fill(false),
            weight: latest.weight,
            height: latest.height,
            oximetry: typeof latest.oximetry === 'string' ? latest.oximetry : '',
            bloodPressure: typeof latest.bloodPressure === 'string' ? latest.bloodPressure : '',
            anamnesisData: latest.anamnesisData || {
              medicalHistory: '',
              medications: '',
              surgeries: '',
              familyHistory: '',
              lifestyle: '',
              diet: '',
              sleep: '',
              stress: '',
              pain: '',
              goals: ''
            }
          });
          setBio(latest.bio);
          setPerimetry(latest.perimetry);
          setDynamometry(latest.dynamometry || { handGripRight: '', handGripLeft: '' });
          setFolds(latest.folds || {
            Peitoral: '', Axilar: '', Tríceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Bíceps: '', Panturrilha: ''
          });
          setPosturalAnalysisResult(latest.posturalAnalysisResult || null);
          setUploadedPhotos(latest.uploadedPhotos || { front: null, back: null, right: null, left: null });
        } else {
          setFormData({
            ...formData,
            name: student.name,
            birthDate: student.birthDate,
            sex: student.sex,
            objective: student.objective,
            anamnesis: student.anamnesis,
            parQAnswers: (student as any).parQAnswers || Array(7).fill(false)
          });
        }
      }
    } else {
      const { data: sData } = await supabase.from('students').select('*').eq('trainer_id', userId);
      const { data: eData } = await supabase.from('evaluations').select('*').eq('trainer_id', userId);
      const { data: schData } = await supabase.from('schedules').select('*').eq('trainer_id', userId);
      
      if (sData) setStudents(sData.map(s => s.data));
      if (eData) setEvaluations(eData.map(e => e.data));
      if (schData) setSchedules(schData.map(sch => sch.data));
    }
  };

  const syncAppState = async () => {
    if (!session?.user?.id) return;
    
    if (profile?.role === 'student') {
      if (students.length > 0) {
        const { error } = await supabase.from('students').update({ data: students[0] }).eq('user_id', session.user.id);
        if (error) console.error('Error syncing student data:', error);
      }
      return;
    }
    
    const sUpserts = students.map(s => ({
      id: s.id,
      trainer_id: session.user.id,
      email: s.email || null,
      data: s
    }));
    if (sUpserts.length > 0) {
      const { error } = await supabase.from('students').upsert(sUpserts);
      if (error) console.error('Error syncing students:', error);
    }

    const eUpserts = evaluations.map(e => ({
      id: e.id,
      trainer_id: session.user.id,
      student_id: e.studentId,
      data: e
    }));
    if (eUpserts.length > 0) {
      const { error } = await supabase.from('evaluations').upsert(eUpserts);
      if (error) console.error('Error syncing evaluations:', error);
    }

    const schUpserts = schedules.map(sch => ({
      id: sch.id,
      trainer_id: session.user.id,
      student_id: sch.studentId,
      data: sch
    }));
    if (schUpserts.length > 0) {
      const { error } = await supabase.from('schedules').upsert(schUpserts);
      if (error) console.error('Error syncing schedules:', error);
    }
  };

  // Save to localStorage and Supabase when state changes
  useEffect(() => {
    localStorage.setItem('perf360_students', JSON.stringify(students));
    syncAppState();
  }, [students]);
  useEffect(() => {
    localStorage.setItem('perf360_evaluations', JSON.stringify(evaluations));
    syncAppState();
  }, [evaluations]);
  useEffect(() => {
    localStorage.setItem('perf360_schedules', JSON.stringify(schedules));
    syncAppState();
  }, [schedules]);

  // Redirecionar aluno se estiver em aba restrita
  useEffect(() => {
    if (viewMode === 'aluno' && (activeTab === 'setup' || activeTab === 'agenda')) {
      setActiveTab('dashboard');
    }
  }, [viewMode, activeTab]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get('connected');
    const accountId = urlParams.get('account_id');
    const tab = urlParams.get('tab');
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success === 'true') {
      alert('Pagamento realizado com sucesso!');
      setBypassedPaywall(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (canceled === 'true') {
      alert('Pagamento cancelado.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (connected === 'true' && accountId && session?.user?.id) {
      // Atualiza o profile no Supabase com o account_id
      const updateStripeAccount = async () => {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ stripe_account_id: accountId })
            .eq('id', session.user.id);
            
          if (error) throw error;
          
          // Atualiza o state local
          setProfile(prev => ({ ...prev, stripe_account_id: accountId }));
          
          // Limpa a URL
          window.history.replaceState({}, document.title, window.location.pathname + '?tab=monetizacao');
          
          alert('Conta Stripe conectada com sucesso!');
        } catch (err) {
          console.error('Erro ao salvar conta Stripe:', err);
        }
      };
      
      updateStripeAccount();
    }
    
    if (tab) {
      setActiveTab(tab);
    }
  }, [session]);

  // Referências para Exportação
  const masterReportRef = useRef<HTMLDivElement>(null);
  const bioReportRef = useRef<HTMLDivElement>(null);
  const dynamometryReportRef = useRef<HTMLDivElement>(null);
  const perimetryReportRef = useRef<HTMLDivElement>(null);
  const skinfoldsReportRef = useRef<HTMLDivElement>(null);
  const setupReportRef = useRef<HTMLDivElement>(null);
  const anamneseReportRef = useRef<HTMLDivElement>(null);
  const comparativosReportRef = useRef<HTMLDivElement>(null);
  const postureReportRef = useRef<HTMLDivElement>(null);
  const relatorioReportRef = useRef<HTMLDivElement>(null);
  const agendaReportRef = useRef<HTMLDivElement>(null);

  const [uploadedPhotos, setUploadedPhotos] = useState<{
    front?: string;
    back?: string;
    right?: string;
    left?: string;
  }>({});

  const handlePhotoUpload = (view: 'front' | 'back' | 'right' | 'left', base64: string) => {
    setUploadedPhotos(prev => ({ ...prev, [view]: base64 }));
  };

  // --- CADASTRO & ANAMNESE ---
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    age: '',
    birthDate: '',
    sex: 'M',
    objective: OBJECTIVES[0],
    anamnesis: [] as string[],
    bloodPressure: '',
    oximetry: '',
    injuries: '',
    parQ: false,
    isTraining: false,
    trainingLevel: 'Iniciante',
    trainingTime: '',
    dailyEffort: 5,
    dietType: '',
    idealWeight: '',
    goalWeight: '',
    medicalReports: [] as string[],
    parQAnswers: Array(7).fill(false) as boolean[],
    workoutPlans: [] as any[],
    workoutPlan: null as any,
    nutritionPlans: [] as any[],
    nutritionPlan: null as any,
    photoUrl: '',
    anamnesisData: {
      sleep: 50,
      stress: 50,
      energy: 50,
      trainingHistory: 50,
      generalHealth: 50,
      pain: 50,
      motivation: 50,
      routine: 50,
      diet: 50,
      dailyActivity: 50,
      alcohol: 50,
      healthFactors: 0
    },
    cardioTest: null as any,
    flexibilityTest: null as any
  });

  const PARQ_QUESTIONS = [
    "Seu médico já disse que você possui um problema de coração e que só deveria realizar atividade física supervisionado por profissionais de saúde?",
    "Você sente dor no peito quando pratica atividade física?",
    "No último mês, você sentiu dor no peito quando praticava atividade física?",
    "Você apresenta desequilíbrio devido a tontura ou ocasionalmente perde a consciência?",
    "Você possui algum problema ósseo ou articular que poderia ser piorado pela atividade física?",
    "Seu médico prescreve atualmente algum medicamento para sua pressão arterial ou condição cardíaca?",
    "Você sabe de alguma outra razão pela qual você não deveria praticar atividade física?"
  ];

  const isAptoParaTestes = useMemo(() => {
    const hasParQIssue = formData.parQAnswers.some(ans => ans === true);
    let sys = 0, dia = 0;
    if (typeof formData.bloodPressure === 'string' && formData.bloodPressure.includes('/')) {
      const parts = formData.bloodPressure.split('/');
      sys = parseInt(parts[0]) || 0;
      dia = parseInt(parts[1]) || 0;
    }
    const highBP = sys >= 140 || dia >= 90;
    
    if (hasParQIssue) return { status: 'BLOQUEADO', color: 'text-red-500', icon: <ShieldAlert size={20}/>, msg: 'Necessita Liberação Médica (PAR-Q Positivo)' };
    if (highBP) return { status: 'ALERTA', color: 'text-yellow-500', icon: <AlertTriangle size={20}/>, msg: 'Pressão Arterial Elevada. Reavaliar antes de testes máximos.' };
    return { status: 'APTO', color: 'text-neon', icon: <CheckCircle2 size={20}/>, msg: 'Liberado para Testes de Esforço e Avaliação Completa' };
  }, [formData.parQAnswers, formData.bloodPressure]);

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const name = formDataObj.get('name') as string;
    const email = formDataObj.get('email') as string;
    const birthDate = formDataObj.get('birthDate') as string;
    const sex = formDataObj.get('sex') as string;
    const objective = formDataObj.get('objective') as string;
    const photoFile = formDataObj.get('photo') as File;

    if (!name || !name.trim()) {
      alert("Por favor, preencha o nome do aluno.");
      return;
    }

    if (!birthDate) {
      alert("Por favor, preencha a data de nascimento.");
      return;
    }

    if (!sex) {
      alert("Por favor, selecione o sexo.");
      return;
    }

    let photoUrl = editingStudent?.photoUrl;
    if (photoFile && photoFile.size > 0) {
      try {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
      } catch (error) {
        console.error("Error reading photo file:", error);
        alert("Erro ao ler a foto do aluno.");
      }
    }

    const studentData: StudentRecord = {
      id: editingStudent?.id || Date.now().toString(),
      name,
      email,
      birthDate,
      sex,
      objective,
      photoUrl,
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
      parQAnswers: editingStudent?.parQAnswers || Array(7).fill(false),
      anamnesis: editingStudent?.anamnesis || [],
      workoutPlans: editingStudent?.workoutPlans || []
    };

    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? studentData : s));
    } else {
      setStudents(prev => [...prev, studentData]);
    }
    
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const openAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student: StudentRecord) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveEvaluation = () => {
    if (!formData.name) {
      alert("Por favor, insira o nome do aluno.");
      return;
    }

    const studentId = selectedStudentId || Date.now().toString();
    
    // Check if student exists, if not create
    if (!selectedStudentId) {
      const newStudent: StudentRecord = {
        id: studentId,
        name: formData.name,
        birthDate: formData.birthDate,
        sex: formData.sex,
        objective: formData.objective,
        anamnesis: formData.anamnesis,
        createdAt: new Date().toISOString(),
        parQAnswers: formData.parQAnswers,
        workoutPlans: formData.workoutPlans || []
      };
      setStudents(prev => [...prev, newStudent]);
      setSelectedStudentId(studentId);
    } else {
      setStudents(prev => prev.map(s => s.id === selectedStudentId ? {
        ...s,
        name: formData.name,
        birthDate: formData.birthDate,
        sex: formData.sex,
        objective: formData.objective,
        anamnesis: formData.anamnesis,
        parQAnswers: formData.parQAnswers,
        workoutPlans: formData.workoutPlans || []
      } : s));
    }

    const newEvaluation: EvaluationRecord = {
      id: Date.now().toString(),
      studentId: studentId,
      date: new Date().toISOString(),
      weight: formData.weight,
      height: formData.height,
      bio: bio,
      perimetry: perimetry,
      dynamometry: dynamometry,
      folds: folds,
      posturalAnalysisResult: posturalAnalysisResult,
      uploadedPhotos: uploadedPhotos,
      oximetry: formData.oximetry,
      bloodPressure: formData.bloodPressure,
      anamnesisData: formData.anamnesisData,
      cardioTest: formData.cardioTest,
      flexibilityTest: formData.flexibilityTest
    };

    setEvaluations(prev => [...prev, newEvaluation]);
    setSelectedEvaluationId(newEvaluation.id);
    alert("Avaliação salva com sucesso!");
  };

  const loadEvaluation = (evaluation: EvaluationRecord, student: StudentRecord) => {
    setSelectedStudentId(student.id);
    setFormData({
      ...formData,
      name: student.name,
      birthDate: student.birthDate,
      sex: student.sex,
      objective: student.objective,
      anamnesis: student.anamnesis,
      parQAnswers: (student as any).parQAnswers || Array(7).fill(false),
      workoutPlans: student.workoutPlans || [],
      workoutPlan: student.workoutPlans && student.workoutPlans.length > 0 ? student.workoutPlans[student.workoutPlans.length - 1] : null,
      photoUrl: student.photoUrl || '',
      weight: evaluation.weight,
      height: evaluation.height,
      oximetry: typeof evaluation.oximetry === 'string' ? evaluation.oximetry : '',
      bloodPressure: typeof evaluation.bloodPressure === 'string' ? evaluation.bloodPressure : '',
      cardioTest: evaluation.cardioTest || null,
      flexibilityTest: evaluation.flexibilityTest || null,
      anamnesisData: evaluation.anamnesisData || {
        sleep: 50, stress: 50, energy: 50, trainingHistory: 50, generalHealth: 50,
        pain: 50, motivation: 50, routine: 50, diet: 50, dailyActivity: 50, alcohol: 50, healthFactors: 0
      }
    });
    setBio(evaluation.bio || { 
      bodyFat: '', muscleRate: '', fatFreeMass: '', subcutaneousFat: '', visceralFat: '',
      bodyWater: '', skeletalMuscle: '', muscleMass: '', boneMass: '', protein: '',
      bmr: '', metabolicAge: '' 
    });
    setPerimetry(evaluation.perimetry || {
      neck: '', shoulder: '', thorax: '', waist: '', abdomen: '', hip: '',
      armRelaxedR: '', armRelaxedL: '', forearmR: '', forearmL: '',
      thighMedialR: '', thighMedialL: '', calfR: '', calfL: '',
      wrist: '', elbow: '', ankle: '', 
      biacromial: '', bicristal: '', femur: ''
    });
    setDynamometry(evaluation.dynamometry || {
      handGripRight: '', handGripLeft: '', bicepsRight: '', bicepsLeft: '', tricepsRight: '', tricepsLeft: '',
      benchPressRight: '', benchPressLeft: '', rowRight: '', rowLeft: '', legExtensionRight: '', legExtensionLeft: '', legCurlRight: '', legCurlLeft: '', legPressRight: '', legPressLeft: '', calfRight: '', calfLeft: ''
    });
    setFolds(evaluation.folds || {
      Peitoral: '', Axilar: '', Tríceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Bíceps: '', Panturrilha: ''
    });
    setPosturalAnalysisResult(evaluation.posturalAnalysisResult || null);
    setUploadedPhotos(evaluation.uploadedPhotos || { front: null, back: null, right: null, left: null });
    setActiveTab('dashboard');
  };

  const startNewEvaluation = (student: StudentRecord) => {
    setSelectedStudentId(student.id);
    setFormData({
      ...formData,
      name: student.name,
      birthDate: student.birthDate,
      sex: student.sex,
      objective: student.objective,
      anamnesis: student.anamnesis,
      parQAnswers: (student as any).parQAnswers || Array(7).fill(false),
      workoutPlans: student.workoutPlans || [],
      workoutPlan: student.workoutPlans && student.workoutPlans.length > 0 ? student.workoutPlans[student.workoutPlans.length - 1] : null,
      photoUrl: student.photoUrl || '',
      weight: '',
      height: '',
      anamnesisData: {
        sleep: 50, stress: 50, energy: 50, trainingHistory: 50, generalHealth: 50,
        pain: 50, motivation: 50, routine: 50, diet: 50, dailyActivity: 50, alcohol: 50, healthFactors: 0
      },
      cardioTest: null,
      flexibilityTest: null
    });
    setBio({ 
      bodyFat: '', muscleRate: '', fatFreeMass: '', subcutaneousFat: '', visceralFat: '',
      bodyWater: '', skeletalMuscle: '', muscleMass: '', boneMass: '', protein: '',
      bmr: '', metabolicAge: '' 
    });
    setPerimetry({
      neck: '', shoulder: '', thorax: '', waist: '', abdomen: '', hip: '',
      armRelaxedR: '', armRelaxedL: '', forearmR: '', forearmL: '',
      thighMedialR: '', thighMedialL: '', calfR: '', calfL: '',
      wrist: '', elbow: '', ankle: '', 
      biacromial: '', bicristal: '', femur: ''
    });
    setDynamometry({
      handGripRight: '', handGripLeft: '', bicepsRight: '', bicepsLeft: '', tricepsRight: '', tricepsLeft: '',
      benchPressRight: '', benchPressLeft: '', rowRight: '', rowLeft: '', legExtensionRight: '', legExtensionLeft: '', legCurlRight: '', legCurlLeft: '', legPressRight: '', legPressLeft: '', calfRight: '', calfLeft: ''
    });
    setFolds({
      Peitoral: '', Axilar: '', Tríceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Bíceps: '', Panturrilha: ''
    });
    setUploadedPhotos({ front: null, back: null, right: null, left: null });
    setPosturalAnalysisResult(null);
    setPerimetryAnalysisResult(null);
    setActiveTab('anamnese');
  };

  const loadEvaluationById = (evaluationId: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const evaluation = evaluations.find(e => e.id === evaluationId);
    
    if (student && evaluation) {
      setSelectedEvaluationId(evaluationId);
      setFormData(prev => ({
        ...prev,
        weight: evaluation.weight,
        height: evaluation.height,
        oximetry: typeof evaluation.oximetry === 'string' ? evaluation.oximetry : '',
        bloodPressure: typeof evaluation.bloodPressure === 'string' ? evaluation.bloodPressure : '',
        anamnesisData: evaluation.anamnesisData || {
          sleep: 50, stress: 50, energy: 50, trainingHistory: 50, generalHealth: 50,
          pain: 50, motivation: 50, routine: 50, diet: 50, dailyActivity: 50, alcohol: 50, healthFactors: 0
        },
        cardioTest: evaluation.cardioTest || null,
        flexibilityTest: evaluation.flexibilityTest || null
      }));
      setBio(evaluation.bio || { 
        bodyFat: '', muscleRate: '', fatFreeMass: '', subcutaneousFat: '', visceralFat: '',
        bodyWater: '', skeletalMuscle: '', muscleMass: '', boneMass: '', protein: '',
        bmr: '', metabolicAge: '' 
      });
      setPerimetry(evaluation.perimetry || {
        neck: '', shoulder: '', thorax: '', waist: '', abdomen: '', hip: '',
        armRelaxedR: '', armRelaxedL: '', forearmR: '', forearmL: '',
        thighMedialR: '', thighMedialL: '', calfR: '', calfL: '',
        wrist: '', elbow: '', ankle: '', 
        biacromial: '', bicristal: '', femur: ''
      });
      setDynamometry(evaluation.dynamometry || {
        handGripRight: '', handGripLeft: '', bicepsRight: '', bicepsLeft: '', tricepsRight: '', tricepsLeft: '',
        benchPressRight: '', benchPressLeft: '', rowRight: '', rowLeft: '', legExtensionRight: '', legExtensionLeft: '', legCurlRight: '', legCurlLeft: '', legPressRight: '', legPressLeft: '', calfRight: '', calfLeft: ''
      });
      setFolds(evaluation.folds || {
        Peitoral: '', Axilar: '', Tríceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Bíceps: '', Panturrilha: ''
      });
      setUploadedPhotos(evaluation.uploadedPhotos || { front: null, back: null, right: null, left: null });
      setPosturalAnalysisResult(evaluation.posturalAnalysisResult || null);
    }
  };

  const loadStudent = (student: StudentRecord) => {
    setSelectedStudentId(student.id);
    setFormData({
      ...formData,
      name: student.name,
      birthDate: student.birthDate,
      sex: student.sex,
      objective: student.objective,
      anamnesis: student.anamnesis,
      parQAnswers: (student as any).parQAnswers || Array(7).fill(false),
      workoutPlans: student.workoutPlans || [],
      workoutPlan: student.workoutPlans && student.workoutPlans.length > 0 ? student.workoutPlans[student.workoutPlans.length - 1] : null,
      nutritionPlans: student.nutritionPlans || [],
      nutritionPlan: student.nutritionPlans && student.nutritionPlans.length > 0 ? student.nutritionPlans[student.nutritionPlans.length - 1] : null,
      photoUrl: student.photoUrl || '',
      cardioTest: null,
      flexibilityTest: null
    });
    
    // Find last evaluation to populate data
    const studentEvals = evaluations.filter(e => e.studentId === student.id).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
    if (studentEvals.length > 0) {
      const last = studentEvals[0];
      setSelectedEvaluationId(last.id);
      setFormData(prev => ({ 
        ...prev, 
        weight: last.weight, 
        height: last.height,
        oximetry: typeof last.oximetry === 'string' ? last.oximetry : '',
        bloodPressure: typeof last.bloodPressure === 'string' ? last.bloodPressure : '',
        anamnesisData: last.anamnesisData || {
          sleep: 50, stress: 50, energy: 50, trainingHistory: 50, generalHealth: 50,
          pain: 50, motivation: 50, routine: 50, diet: 50, dailyActivity: 50, alcohol: 50, healthFactors: 0
        },
        cardioTest: last.cardioTest || null,
        flexibilityTest: last.flexibilityTest || null
      }));
      setBio(last.bio || { 
        bodyFat: '', muscleRate: '', fatFreeMass: '', subcutaneousFat: '', visceralFat: '',
        bodyWater: '', skeletalMuscle: '', muscleMass: '', boneMass: '', protein: '',
        bmr: '', metabolicAge: '' 
      });
      setPerimetry(last.perimetry || {
        neck: '', shoulder: '', thorax: '', waist: '', abdomen: '', hip: '',
        armRelaxedR: '', armRelaxedL: '', forearmR: '', forearmL: '',
        thighMedialR: '', thighMedialL: '', calfR: '', calfL: '',
        wrist: '', elbow: '', ankle: '', 
        biacromial: '', bicristal: '', femur: ''
      });
      setDynamometry(last.dynamometry || {
        handGripRight: '', handGripLeft: '', bicepsRight: '', bicepsLeft: '', tricepsRight: '', tricepsLeft: '',
        benchPressRight: '', benchPressLeft: '', rowRight: '', rowLeft: '', legExtensionRight: '', legExtensionLeft: '', legCurlRight: '', legCurlLeft: '', legPressRight: '', legPressLeft: '', calfRight: '', calfLeft: ''
      });
      setFolds(last.folds || {
        Peitoral: '', Axilar: '', Triceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Biceps: '', Panturrilha: ''
      });
      setUploadedPhotos(last.uploadedPhotos || { front: null, back: null, right: null, left: null });
      setPosturalAnalysisResult(last.posturalAnalysisResult || null);
    } else {
      setSelectedEvaluationId(null);
      startNewEvaluation(student);
    }
    
    if (student.workoutPlans && student.workoutPlans.length > 0) {
      setSelectedWorkoutPlanId(student.workoutPlans[student.workoutPlans.length - 1].id || null);
    } else {
      setSelectedWorkoutPlanId(null);
    }
    
    setActiveTab('dashboard');
  };

  const deleteStudent = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este aluno e todo seu histórico?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setEvaluations(prev => prev.filter(e => e.studentId !== id));
      setSchedules(prev => prev.filter(sch => sch.studentId !== id));
      if (selectedStudentId === id) setSelectedStudentId(null);
      
      if (session?.user?.id) {
        await supabase.from('students').delete().eq('id', id);
      }
    }
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, medicalReports: [...prev.medicalReports, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAnalyzeDocs = async () => {
    if (formData.medicalReports.length === 0) return;
    setLoadingDocs(true);
    try {
      const trainerInfo = { name: trainerName, cref: trainerCref, title: trainerTitle };
      const result = await analyzeMedicalDocuments({ name: formData.name }, formData.medicalReports, trainerInfo);
      setDocAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const evolutionData = useMemo(() => {
    if (!selectedStudentId) return [];
    return evaluations
      .filter(e => e.studentId === selectedStudentId)
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
      })
      .map(e => {
        const d = new Date(e.date);
        return {
          date: isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('pt-BR'),
          weight: parseFloat(e.weight) || 0,
          bf: parseFloat(e.bio?.bodyFat) || 0,
          muscle: parseFloat(e.bio?.muscleMass) || 0
        };
      });
  }, [evaluations, selectedStudentId]);

  const exportToCSV = () => {
    if (evaluations.length === 0) return;
    const headers = ["Data", "Aluno", "Peso", "Altura", "BF%", "Massa Muscular"];
    const rows = evaluations.map(e => {
      const student = students.find(s => s.id === e.studentId);
      const d = new Date(e.date);
      return [
        isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('pt-BR'),
        student?.name || 'N/A',
        e.weight,
        e.height,
        e.bio?.bodyFat || '',
        e.bio?.muscleMass || ''
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historico_avaliacoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cálculo Automático de Idade
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  // --- DINAMOMETRIA ---
  const [dynamometry, setDynamometry] = useState({
    handGripRight: '',
    handGripLeft: '',
    bicepsRight: '',
    bicepsLeft: '',
    tricepsRight: '',
    tricepsLeft: '',
    benchPressRight: '',
    benchPressLeft: '',
    rowRight: '',
    rowLeft: '',
    legExtensionRight: '',
    legExtensionLeft: '',
    legCurlRight: '',
    legCurlLeft: '',
    legPressRight: '',
    legPressLeft: '',
    calfRight: '',
    calfLeft: ''
  });

  // --- BIOIMPEDÂNCIA ---
  const [bio, setBio] = useState({
    bodyFat: '', 
    muscleRate: '', 
    fatFreeMass: '', 
    subcutaneousFat: '', 
    visceralFat: '',
    bodyWater: '', 
    skeletalMuscle: '', 
    muscleMass: '', 
    boneMass: '', 
    protein: '',
    bmr: '', 
    metabolicAge: ''
  });

  const computedBMI = useMemo(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height) / 100;
    if (!w || !h) return '0.0';
    return (w / (h * h)).toFixed(1);
  }, [formData.weight, formData.height]);

  // --- PERIMETRIA ---
  const [perimetry, setPerimetry] = useState({
    neck: '', shoulder: '', thorax: '', waist: '', abdomen: '', hip: '',
    armRelaxedR: '', armRelaxedL: '', forearmR: '', forearmL: '',
    thighMedialR: '', thighMedialL: '', calfR: '', calfL: '',
    wrist: '', elbow: '', ankle: '', 
    biacromial: '', bicristal: '', femur: ''
  });

  const [perimetryAnalysisResult, setPerimetryAnalysisResult] = useState<string | null>(null);
  const [dynamometryAnalysisResult, setDynamometryAnalysisResult] = useState<string | null>(null);

  // --- DOBRAS CUTÂNEAS ---
  const [skinfoldProfile, setSkinfoldProfile] = useState('Sedentário adulto');
  const [skinfoldProtocol, setSkinfoldProtocol] = useState('Jackson & Pollock – 3 dobras');
  const [folds, setFolds] = useState({
    Peitoral: '', Axilar: '', Tríceps: '', Subescapular: '', Abdominal: '', Suprailiaca: '', Coxa: '', Bíceps: '', Panturrilha: ''
  });

  // Lógica de seleção de protocolo de dobras
  useEffect(() => {
    if (skinfoldProfile === 'Atleta') setSkinfoldProtocol('Jackson & Pollock – 7 dobras');
    else if (skinfoldProfile === 'Idoso' || skinfoldProfile === 'Obeso') setSkinfoldProtocol('Durnin & Womersley – 4 dobras');
    else if (skinfoldProfile === 'Criança / Adolescente') setSkinfoldProtocol('Slaughter – 2 dobras');
    else if (skinfoldProfile === 'Mulher (Pollock 4 dobras)') setSkinfoldProtocol('Pollock – 4 dobras (Mulheres)');
    else if (skinfoldProfile === 'Mulher (Guedes 3 dobras)') setSkinfoldProtocol('Guedes – 3 dobras (Mulheres)');
    else setSkinfoldProtocol('Jackson & Pollock – 3 dobras');
  }, [skinfoldProfile]);

  const requiredFolds = useMemo(() => {
    const p = skinfoldProtocol;
    const s = formData.sex;
    if (p === 'Jackson & Pollock – 3 dobras') {
      return s === 'M' ? ['Peitoral', 'Abdominal', 'Coxa'] : ['Tríceps', 'Suprailiaca', 'Coxa'];
    }
    if (p === 'Jackson & Pollock – 7 dobras') {
      return ['Peitoral', 'Axilar', 'Tríceps', 'Subescapular', 'Abdominal', 'Suprailiaca', 'Coxa'];
    }
    if (p === 'Durnin & Womersley – 4 dobras') {
      return ['Tríceps', 'Bíceps', 'Subescapular', 'Suprailiaca'];
    }
    if (p === 'Slaughter – 2 dobras') {
      return ['Tríceps', 'Subescapular'];
    }
    if (p === 'Pollock – 4 dobras (Mulheres)') {
      return ['Tríceps', 'Suprailiaca', 'Abdominal', 'Coxa'];
    }
    if (p === 'Guedes – 3 dobras (Mulheres)') {
      return ['Coxa', 'Suprailiaca', 'Subescapular'];
    }
    return Object.keys(folds);
  }, [skinfoldProtocol, formData.sex]);

  // --- CÁLCULOS TÉCNICOS INTEGRADOS (BIO & SKINFOLDS) ---
  const technicalAnalyses = useMemo(() => {
    const weight = parseFloat(formData.weight) || 0;
    const height = parseFloat(formData.height) || 0;
    const age = parseInt(formData.age) || 0;
    const sex = formData.sex;
    
    // Prioriza gordura da Bioimpedância se preenchida, senão tenta dobras (vazio = 0)
    const bfBio = parseFloat(bio.bodyFat) || 0;
    
    // Cálculo de Água (35ml por kg)
    const water = weight * 0.035;

    // TMB (Mifflin-St Jeor)
    let bmrCalc = (10 * weight) + (6.25 * height) - (5 * age);
    bmrCalc = sex === 'M' ? bmrCalc + 5 : bmrCalc - 161;
    
    // TDEE (Gasto Total - Nível Ativo 1.5)
    const tdee = bmrCalc * 1.5;

    // Prescrição de Macros
    const prot = weight * 2.2; // Alvo atleta/hipertrofia
    const fat = weight * 0.8;
    const carb = (tdee - (prot * 4 + fat * 9)) / 4;

    // Meta de Peso (Ideal BF 12-15% M, 18-22% F)
    const targetBF = sex === 'M' ? 12 : 20;
    const currentFatKg = weight * (bfBio / 100);
    const weightToLose = bfBio > targetBF ? currentFatKg - (weight * (targetBF / 100)) : 0;

    return {
      water: water.toFixed(1),
      calories: tdee.toFixed(0),
      macros: { p: prot.toFixed(0), c: carb.toFixed(0), f: fat.toFixed(0) },
      toLose: weightToLose.toFixed(1),
      exerciseTarget: (tdee * 0.2).toFixed(0), // 20% do gasto total em exercício
      recommendation: bfBio > targetBF ? 'Foco em Oxidação de Gordura (Déficit)' : 'Foco em Construção Muscular (Superávit)'
    };
  }, [formData, bio]);

  const skinfoldResults = useMemo(() => {
    // Mantendo a lógica de dobras para consistência em outras abas
    return { fatPercentage: bio.bodyFat || '0.0', mg: '0', mm: '0' };
  }, [bio.bodyFat]);

  const shapeAnalysis = useMemo(() => {
    const BF = parseFloat(bio.bodyFat) || 0;
    const score = 100 - (BF * 1.5);
    const totalScoreValue = clamp(score + 15, 0, 100);
    let level = totalScoreValue >= 85 ? "Palco" : totalScoreValue >= 70 ? "Elite" : "Base";
    let color = totalScoreValue >= 85 ? "#39FF14" : totalScoreValue >= 70 ? "#18B26A" : "#666";
    return { totalScore: totalScoreValue.toFixed(0), level, color };
  }, [bio]);

  const dnaAnalysis = useMemo(() => {
    const weight = parseFloat(formData.weight) || 70;
    const meso = 1 + 6 * clamp((weight/100), 0, 1);
    const scoreDNA = meso * 10;
    return { scoreDNA: clamp(scoreDNA, 0, 100).toFixed(0), endo: 3, meso: 5, ecto: 2 };
  }, [formData]);

  const dynamometryAnalysis = useMemo(() => {
    const f = (val: any) => parseFloat(val) || 0;
    const w = parseFloat(formData.weight) || 1; // prevent division by zero
    const d = dynamometry;

    // Helper for total load
    const total = (r: any, l: any) => f(r) + f(l);

    // 1. Força Relativa
    const relBiceps = total(d.bicepsRight, d.bicepsLeft) / w;
    const relTriceps = total(d.tricepsRight, d.tricepsLeft) / w;
    const relBenchPress = total(d.benchPressRight, d.benchPressLeft) / w;
    const relRow = total(d.rowRight, d.rowLeft) / w;
    const relLegExtension = total(d.legExtensionRight, d.legExtensionLeft) / w;
    const relLegCurl = total(d.legCurlRight, d.legCurlLeft) / w;
    const relLegPress = total(d.legPressRight, d.legPressLeft) / w;
    const relCalf = total(d.calfRight, d.calfLeft) / w;

    // 2. Classificação de Força Relativa
    const classifyStrength = (rel: number, type: 'upper' | 'lower') => {
      if (rel === 0) return 'N/A';
      if (type === 'upper') {
        if (rel < 0.5) return 'Iniciante';
        if (rel < 0.8) return 'Intermediário';
        if (rel < 1.2) return 'Avançado';
        return 'Elite';
      } else {
        if (rel < 1.0) return 'Iniciante';
        if (rel < 1.5) return 'Intermediário';
        if (rel < 2.0) return 'Avançado';
        return 'Elite';
      }
    };

    // 3. Hand Grip
    const hgR = f(d.handGripRight);
    const hgL = f(d.handGripLeft);
    const hgMax = Math.max(hgR, hgL);
    const hgMin = Math.min(hgR, hgL);
    
    const classifyHandGrip = (val: number) => {
      if (val === 0) return 'N/A';
      if (val < 30) return 'Baixo';
      if (val < 45) return 'Médio';
      if (val < 60) return 'Bom';
      return 'Excelente';
    };

    // 4. Simetria Bilateral
    const getSymmetry = (r: any, l: any) => {
      const right = f(r);
      const left = f(l);
      const max = Math.max(right, left);
      const min = Math.min(right, left);
      return max > 0 ? ((max - min) / max) * 100 : 0;
    };

    const classifyAsymmetry = (asym: number, max: number) => {
      if (max === 0) return 'N/A';
      if (asym <= 10) return 'Simetria Ideal';
      if (asym <= 15) return 'Leve Assimetria';
      return 'Assimetria Relevante';
    };

    const hgAsymmetry = getSymmetry(d.handGripRight, d.handGripLeft);
    
    const symmetries = {
      biceps: getSymmetry(d.bicepsRight, d.bicepsLeft),
      triceps: getSymmetry(d.tricepsRight, d.tricepsLeft),
      benchPress: getSymmetry(d.benchPressRight, d.benchPressLeft),
      row: getSymmetry(d.rowRight, d.rowLeft),
      legExtension: getSymmetry(d.legExtensionRight, d.legExtensionLeft),
      legCurl: getSymmetry(d.legCurlRight, d.legCurlLeft),
      legPress: getSymmetry(d.legPressRight, d.legPressLeft),
      calf: getSymmetry(d.calfRight, d.calfLeft),
    };

    // 5. Índice Neuromuscular (INM)
    const inm = (relBenchPress + relRow + relLegExtension + relLegPress) / 4;
    const classifyINM = (val: number) => {
      if (val === 0) return 'N/A';
      if (val < 0.80) return 'Baixo';
      if (val <= 1.20) return 'Moderado';
      if (val <= 1.60) return 'Alto';
      return 'Atlético';
    };

    // 6. Relação Superior vs Inferior
    const avgUpper = (relBiceps + relTriceps + relBenchPress + relRow) / 4;
    const avgLower = (relLegExtension + relLegCurl + relLegPress + relCalf) / 4;
    const upperLowerRatio = avgLower > 0 ? avgUpper / avgLower : 0;
    const classifyRatio = (ratio: number) => {
      if (avgLower === 0) return 'N/A';
      if (ratio < 0.60) return 'Dominância Inferior';
      if (ratio <= 0.80) return 'Equilíbrio Ideal';
      return 'Dominância Superior';
    };

    // 7. Dominância Muscular
    const checkImbalance = (val1: number, val2: number, name1: string, name2: string) => {
      if (val1 === 0 || val2 === 0) return null;
      const max = Math.max(val1, val2);
      const min = Math.min(val1, val2);
      const diff = ((max - min) / max) * 100;
      if (diff > 20) {
        return `Desequilíbrio: ${val1 > val2 ? name1 : name2} dominante (${diff.toFixed(1)}%)`;
      }
      return null;
    };
    
    const imbalances = [
      checkImbalance(relBiceps, relTriceps, 'Bíceps', 'Tríceps'),
      checkImbalance(relLegExtension, relLegCurl, 'Extensora', 'Flexora'),
      checkImbalance(relBenchPress, relRow, 'Supino', 'Remada')
    ].filter(Boolean);

    // 8. Score Global
    let score = 0;
    if (inm > 0) {
      if (inm >= 1.6) score += 40;
      else if (inm >= 1.2) score += 30;
      else if (inm >= 0.8) score += 20;
      else score += 10;
      
      if (hgAsymmetry <= 10) score += 20;
      else if (hgAsymmetry <= 15) score += 10;
      
      if (hgMax >= 60) score += 20;
      else if (hgMax >= 45) score += 15;
      else if (hgMax >= 30) score += 10;
      
      if (imbalances.length === 0) score += 20;
      else if (imbalances.length === 1) score += 10;
    }
    
    const classifyScore = (s: number) => {
      if (inm === 0) return 'N/A';
      if (s <= 40) return 'Básico';
      if (s <= 60) return 'Intermediário';
      if (s <= 80) return 'Avançado';
      return 'Performance Atlética';
    };

    return {
      relBiceps, relTriceps, relBenchPress, relRow,
      relLegExtension, relLegCurl, relLegPress, relCalf,
      classifyStrength,
      hgR, hgL, hgMax, hgMin, hgAsymmetry, classifyHandGrip, classifyAsymmetry,
      symmetries,
      inm, classifyINM,
      upperLowerRatio, classifyRatio,
      imbalances,
      score, classifyScore
    };
  }, [dynamometry, formData.weight]);

  const perimetryIndices = useMemo(() => {
    const f = (val: any) => parseFloat(val) || 0;
    const p = perimetry;
    const h = parseFloat(formData.height) || 170;

    const rcq = f(p.waist) / (f(p.hip) || 1);
    const whtr = f(p.waist) / h;
    const shoulderWaist = f(p.shoulder) / (f(p.waist) || 1);
    const chestWaist = f(p.thorax) / (f(p.waist) || 1);
    const armChest = ((f(p.armRelaxedR) + f(p.armRelaxedL)) / 2) / (f(p.thorax) || 1);
    const thighWaist = ((f(p.thighMedialR) + f(p.thighMedialL)) / 2) / (f(p.waist) || 1);
    const armCalfSym = ((f(p.armRelaxedR) + f(p.armRelaxedL)) / 2) / (((f(p.calfR) + f(p.calfL)) / 2) || 1);
    const chestThigh = f(p.thorax) / (((f(p.thighMedialR) + f(p.thighMedialL)) / 2) || 1);

    return {
      rcq: rcq > 0 ? rcq.toFixed(2) : '-',
      whtr: whtr > 0 ? whtr.toFixed(2) : '-',
      shoulderWaist: shoulderWaist > 0 ? shoulderWaist.toFixed(2) : '-',
      chestWaist: chestWaist > 0 ? chestWaist.toFixed(2) : '-',
      armChest: armChest > 0 ? armChest.toFixed(2) : '-',
      thighWaist: thighWaist > 0 ? thighWaist.toFixed(2) : '-',
      armCalfSym: armCalfSym > 0 ? armCalfSym.toFixed(2) : '-',
      chestThigh: chestThigh > 0 ? chestThigh.toFixed(2) : '-'
    };
  }, [perimetry, formData.height]);

  const handleExportImage = async (ref: React.RefObject<HTMLDivElement | null>, fileName: string, format: 'png' | 'pdf' = 'png') => {
    if (!ref.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(ref.current as HTMLElement, { 
        backgroundColor: '#0A0A0A', 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const margin = 10; // 10mm margin
        const overlap = 5; // 5mm overlap between pages to prevent cut-off text
        const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pdfHeight = pageHeight - (margin * 2);
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = pdfWidth / imgWidth;
        const scaledHeight = imgHeight * ratio;
        
        let heightLeft = scaledHeight;
        let position = margin;
        
        pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - scaledHeight + margin + overlap;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, pdfWidth, scaledHeight);
          heightLeft -= (pdfHeight - overlap);
        }
        
        pdf.save(`${fileName}.pdf`);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Ocorreu um erro ao gerar o relatório. Verifique se todas as imagens carregaram corretamente.');
    } finally { 
      setIsExporting(false); 
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*Avaliação Física - ${OWNER_INFO.appTitle}*\n\n` +
      `*Aluno:* ${formData.name}\n` +
      `*Objetivo:* ${formData.objective}\n` +
      `*Peso:* ${formData.weight} kg\n` +
      `*Gordura Corporal:* ${bio.bodyFat}%\n` +
      `*Massa Muscular:* ${bio.muscleMass}kg\n\n` +
      `*Resumo do Laudo:*\n${posturalAnalysisResult ? posturalAnalysisResult.substring(0, 200) + '...' : 'Avaliação completa disponível no sistema.'}\n\n` +
      `*${trainerName}* - ${trainerCref}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleGenerateAIAnalysis = async (type: 'posture' | 'perimetry' | 'dynamometry') => {
    setLoadingAnalysis(true);
    try {
      const student: any = { name: formData.name || 'Aluno', gender: formData.sex, birthDate: formData.birthDate, id: formData.objective, height: formData.height, weight: formData.weight };
      const evaluation = { 
        anthropometry: { weight: parseFloat(formData.weight), height: parseFloat(formData.height) }, 
        perimetry, 
        dynamometry,
        oximetry: formData.oximetry,
        bloodPressure: formData.bloodPressure
      };
      const base64Images = Object.values(uploadedPhotos).filter(Boolean) as string[];
      
      const trainerInfo = { name: trainerName, cref: trainerCref, title: trainerTitle };
      
      if (type === 'posture') {
        const result = await generateProfessionalAnalysis(student, evaluation, base64Images, trainerInfo);
        setPosturalAnalysisResult(result || "");
      } else if (type === 'perimetry') {
        const result = await generatePerimetryAnalysis(student, evaluation, trainerInfo);
        setPerimetryAnalysisResult(result || "");
      } else if (type === 'dynamometry') {
        const result = await generateDynamometryAnalysis(student, evaluation, dynamometryAnalysis, trainerInfo);
        setDynamometryAnalysisResult(result || "");
      }
    } catch (e) { console.error(e); } finally { setLoadingAnalysis(false); }
  };

  if (!session) {
    return <Auth />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={48} />
      </div>
    );
  }

  if (profile.role === 'pending') {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <div className="glass-card max-w-md p-12 rounded-[40px] text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-yellow-500" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white">Acesso Pendente</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Seu cadastro foi recebido e está aguardando aprovação do administrador. 
            Você receberá uma notificação assim que seu acesso for liberado.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  if (profile.role !== 'admin' && profile.subscription_status !== 'active' && !bypassedPaywall) {
    if (profile.role === 'student') {
      return <StudentPaywall onSubscribe={handleSubscribe} onBypass={() => setBypassedPaywall(true)} />;
    } else if (profile.role === 'trainer') {
      return <TrainerPaywall onSubscribe={handleSubscribe} onBypass={() => setBypassedPaywall(true)} />;
    }
  }

  return (
    <>
    <div className="min-h-screen flex flex-col md:flex-row bg-dark text-white font-sans selection:bg-neon selection:text-dark print:hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-dark/95 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {trainerLogo ? (
            <img src={trainerLogo} alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
          ) : (
            <div className="w-8 h-8 bg-neon rounded-xl flex items-center justify-center text-dark font-black text-sm shadow-neon">360</div>
          )}
          <div className="flex flex-col">
            <span className="font-display font-black text-sm tracking-tighter leading-none">{OWNER_INFO.appTitle.toUpperCase()}</span>
            <span className="text-[8px] text-neon-dark font-bold uppercase tracking-widest mt-0.5">{trainerName}</span>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-[100dvh] w-72 border-r border-white/5 bg-dark/95 backdrop-blur-xl flex flex-col z-50 md:z-40 print:hidden transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-white/5 hidden md:block">
          <div className="flex items-center gap-4 mb-1">
            {trainerLogo ? (
              <img src={trainerLogo} alt="Logo" className="w-12 h-12 rounded-2xl object-cover" />
            ) : (
              <div className="w-12 h-12 bg-neon rounded-2xl flex items-center justify-center text-dark font-black text-2xl shadow-neon">360</div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-tighter leading-none">{OWNER_INFO.appTitle.toUpperCase()}</span>
              <span className="text-[10px] text-neon-dark font-bold uppercase tracking-widest mt-1">{trainerName}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {MENU_ITEMS.filter(item => {
            if (item.id === 'admin' && profile?.role !== 'admin') return false;
            if (viewMode === 'aluno' && (item.id === 'setup' || item.id === 'agenda' || item.id === 'monetizacao')) return false;
            return true;
          }).map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-neon/10 text-neon shadow-[inset_0_0_15px_rgba(57,255,20,0.05)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className={activeTab === item.id ? 'scale-110 text-neon' : ''}>{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300">
            <Power size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden print:overflow-visible w-full">
        <header className="h-auto min-h-24 py-4 md:py-0 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-10 bg-dark/50 relative md:sticky top-0 z-30 backdrop-blur-md print:hidden gap-4 md:gap-0">
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-neon animate-pulse" />
              <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.4em]">LIVE MONITOR v6.0</span>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10" />
            <div className="flex flex-col justify-center w-full md:w-auto">
              <div className="flex items-center gap-3">
                {formData.photoUrl && (
                  <img src={formData.photoUrl} alt="Foto do Aluno" className="w-10 h-10 rounded-full object-cover border-2 border-neon" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase tracking-widest truncate max-w-[200px] md:max-w-none">
                    {selectedStudentId ? students.find(s => s.id === selectedStudentId)?.name : (formData.name || 'AGUARDANDO DADOS...')}
                  </span>
                  {selectedStudentId && (
                    <div className="flex gap-2 mt-1">
                      <select 
                        value={selectedEvaluationId || ''} 
                        onChange={(e) => loadEvaluationById(e.target.value, selectedStudentId)}
                        className="bg-transparent text-[10px] text-gray-400 border-none outline-none cursor-pointer hover:text-white"
                      >
                        <option value="" disabled>Selecione uma avaliação</option>
                        {evaluations.filter(e => e.studentId === selectedStudentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                          <option key={e.id} value={e.id} className="bg-dark text-white">Avaliação: {new Date(e.date).toLocaleDateString('pt-BR')}</option>
                        ))}
                      </select>
                      <select 
                        value={selectedWorkoutPlanId || ''} 
                        onChange={(e) => {
                          setSelectedWorkoutPlanId(e.target.value);
                          const student = students.find(s => s.id === selectedStudentId);
                          if (student && student.workoutPlans) {
                            const plan = student.workoutPlans.find(p => p.id === e.target.value);
                            if (plan) {
                              setFormData(prev => ({ ...prev, workoutPlan: plan }));
                            }
                          }
                        }}
                        className="bg-transparent text-[10px] text-gray-400 border-none outline-none cursor-pointer hover:text-white"
                      >
                        <option value="" disabled>Selecione um treino</option>
                        {students.find(s => s.id === selectedStudentId)?.workoutPlans?.map(p => (
                          <option key={p.id} value={p.id} className="bg-dark text-white">Treino: {p.name || new Date(p.date || Date.now()).toLocaleDateString('pt-BR')}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-6 mt-1">
                <span className="text-[10px] font-bold text-neon uppercase tracking-tighter flex items-center gap-1.5"><Droplets size={12}/> {bio.bodyFat || '0'}% BF</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter flex items-center gap-1.5"><Activity size={12}/> IMC {computedBMI}</span>
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter flex items-center gap-1.5"><Trophy size={12}/> SCORE {shapeAnalysis.totalScore}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-10 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden md:block text-right border-r border-white/10 pr-10">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">{trainerCref}</p>
              <p className="text-xs text-neon font-black uppercase tracking-widest">{trainerName}</p>
            </div>
            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={handleClearCache}
                disabled={isSyncing}
                title="Limpar Cache e Recarregar"
                className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all disabled:opacity-50 text-gray-400"
              >
                <HardDrive size={20} className={`md:w-6 md:h-6 ${isSyncing ? 'animate-pulse' : ''}`} />
              </button>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                title="Sincronizar Dados"
                className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-neon hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={`text-neon md:w-7 md:h-7 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-12 pb-44 max-w-7xl mx-auto space-y-12 md:space-y-24">
          
          {/* ALUNOS & HISTÓRICO - REMOVIDO POIS AGORA É A ABA SETUP */}
          
          {/* STUDENT MODAL */}
          {isStudentModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="glass-card w-full max-w-2xl rounded-[48px] border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                  <h2 className="text-3xl font-black italic uppercase text-white">{editingStudent ? 'Editar Aluno' : 'Novo Aluno'}</h2>
                  <button onClick={() => setIsStudentModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleSaveStudent} className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Nome Completo</label>
                      <input name="name" required defaultValue={editingStudent?.name} className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl outline-none focus:border-neon transition-all text-white" placeholder="NOME DO ALUNO" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">E-mail (Para Login do Aluno)</label>
                      <input name="email" type="email" defaultValue={editingStudent?.email} className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl outline-none focus:border-neon transition-all text-white" placeholder="email@exemplo.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Data de Nascimento</label>
                      <input name="birthDate" type="date" required defaultValue={editingStudent?.birthDate} className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-lg outline-none focus:border-neon transition-all text-white" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Sexo</label>
                      <select name="sex" defaultValue={editingStudent?.sex || 'M'} className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-lg outline-none focus:border-neon transition-all text-white">
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Objetivo Principal</label>
                      <select name="objective" defaultValue={editingStudent?.objective || OBJECTIVES[0]} className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-lg outline-none focus:border-neon transition-all text-white">
                        {OBJECTIVES.map(obj => <option key={obj} value={obj}>{obj}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Foto do Aluno (Opcional)</label>
                      <input name="photo" type="file" accept="image/*" className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-lg outline-none focus:border-neon transition-all text-white" />
                      {editingStudent?.photoUrl && (
                        <div className="mt-2">
                          <img src={editingStudent.photoUrl} alt="Foto Atual" className="w-16 h-16 rounded-full object-cover border-2 border-neon" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-6">
                    <button type="submit" className="w-full py-6 bg-neon text-dark font-black rounded-[24px] uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-neon">
                      <Save size={20} /> {editingStudent ? 'Atualizar Cadastro' : 'Cadastrar Aluno'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EVOLUÇÃO */}
          {activeTab === 'evolucao' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Análise de<br/><span className="text-blue-500">Evolução</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Comparativo Histórico de Performance</p>
                </div>
                {selectedStudentId && (
                  <div className="text-right">
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Aluno Selecionado</p>
                    <p className="text-xl text-neon font-black uppercase tracking-widest">{students.find(s => s.id === selectedStudentId)?.name}</p>
                  </div>
                )}
              </div>

              {evolutionData.length > 1 ? (
                <div className="grid grid-cols-1 gap-12">
                  <div className="glass-card p-12 rounded-[56px] border-white/5">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4"><TrendingUp size={18} className="text-neon"/> Curva de Peso & Gordura Corporal</h3>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={evolutionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '16px' }}
                            itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                          <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#39FF14" strokeWidth={4} dot={{ r: 6, fill: '#39FF14' }} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="bf" name="Gordura (%)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-12 rounded-[56px] border-white/5">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4"><Activity size={18} className="text-blue-500"/> Massa Muscular (kg)</h3>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={evolutionData}>
                          <defs>
                            <linearGradient id="colorMuscle" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '16px' }}
                          />
                          <Area type="monotone" dataKey="muscle" name="Massa Muscular" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMuscle)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-20 rounded-[56px] border-white/5 text-center">
                  <Activity size={64} className="text-gray-700 mx-auto mb-8" />
                  <h3 className="text-2xl font-black uppercase tracking-widest text-gray-500">Dados Insuficientes</h3>
                  <p className="text-gray-600 mt-4 max-w-md mx-auto">Realize pelo menos duas avaliações para visualizar o gráfico de evolução comparativa.</p>
                </div>
              )}
            </div>
          )}

          {/* AGENDA */}
          {activeTab === 'agenda' && viewMode === 'avaliador' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Agenda de<br/><span className="text-yellow-500">Avaliações</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Planejamento e Próximos Passos</p>
                </div>
              </div>

              <CalendarComponent 
                schedules={schedules} 
                setSchedules={setSchedules} 
                students={students} 
                selectedStudentId={selectedStudentId} 
              />
            </div>
          )}
          
          {/* DASHBOARD 360 */}
          {activeTab === 'dashboard' && (
            <div ref={masterReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black italic uppercase leading-tight tracking-tighter break-words">Power<br/><span className="text-neon">Intelligence</span></h1>
                  <p className="text-gray-500 text-xs md:text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase break-words">Relatório Mestre de Performance Consolidado</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                  <button onClick={exportToCSV} className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-6 bg-white/5 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <FileText size={22} /> Exportar Planilha (CSV)
                  </button>
                  <button onClick={() => handleExportImage(masterReportRef, 'Relatorio-Mestre-Performance-360', 'pdf')} className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-6 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-neon">
                    <FileDown size={22} /> Gerar Relatório Master (PDF)
                  </button>
                </div>
              </div>

              <MasterDashboard 
                bio={bio}
                formData={formData}
                computedBMI={computedBMI}
                dnaAnalysis={dnaAnalysis}
                shapeAnalysis={shapeAnalysis}
                folds={folds}
                perimetry={perimetry}
                dynamometry={dynamometry}
                cardioTest={formData.cardioTest}
                flexibilityTest={formData.flexibilityTest}
              />
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Dashboard 360" 
                studentName={formData.name} 
                data={{ bio, perimetry, folds, dynamometry }} 
                onExportPdf={() => handleExportImage(masterReportRef, 'Relatorio-Mestre-Performance-360', 'pdf')} 
              />
            </div>
          )}

          {/* BIOIMPEDÂNCIA - ABA COMPLETA */}
          {activeTab === 'bio' && (
            <div ref={bioReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Bioimpedância<br/><span className="text-blue-500">Multifatorial</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Mapeamento Fisiológico & Prescrição Inteligente</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setShowBioHelp(!showBioHelp)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <HelpCircle size={20} /> Como Fazer
                  </button>
                  <button onClick={() => handleExportImage(bioReportRef, 'Laudo-Bioimpedancia-Profissional', 'pdf')} className="px-10 py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl">
                    <Download size={20} /> Exportar Laudo Fisiológico (PDF)
                  </button>
                </div>
              </div>

              {showBioHelp && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4 animate-scale-in">
                  <h3 className="text-blue-500 font-black uppercase tracking-widest text-sm">Instruções: Preparo para Bioimpedância</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li>Jejum de 4 horas (sólidos e líquidos).</li>
                    <li>Não consumir bebidas alcoólicas ou com cafeína 24 horas antes.</li>
                    <li>Não realizar exercícios físicos intensos 24 horas antes.</li>
                    <li>Esvaziar a bexiga antes do teste.</li>
                    <li>Retirar objetos metálicos (joias, relógios).</li>
                    <li>Mulheres: evitar realizar o teste no período menstrual.</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Inputs de Medidas */}
                <div className="lg:col-span-4 glass-card p-10 rounded-[56px] space-y-10 border-white/5">
                   <div className="space-y-2 border-b border-white/5 pb-6">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Peso de Referência (Cadastro)</span>
                      <p className="text-3xl font-black italic text-white">{formData.weight || '0.0'} kg</p>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                     {[
                       { k: 'bodyFat', l: 'Gordura Corporal (%)', c: 'text-red-500', u: '%' },
                       { k: 'muscleRate', l: 'Taxa Muscular (%)', c: 'text-neon', u: '%' },
                       { k: 'fatFreeMass', l: 'Massa Livre de Gordura (kg)', c: 'text-blue-400', u: 'kg' },
                       { k: 'subcutaneousFat', l: 'Gordura Subcutânea (%)', c: 'text-orange-400', u: '%' },
                       { k: 'visceralFat', l: 'Gordura Visceral (Nível)', c: 'text-red-600', u: '' },
                       { k: 'bodyWater', l: 'Água Corporal (%)', c: 'text-cyan-500', u: '%' },
                       { k: 'skeletalMuscle', l: 'Músculo Esquelético (%)', c: 'text-emerald-400', u: '%' },
                       { k: 'muscleMass', l: 'Massa Muscular (kg)', c: 'text-green-500', u: 'kg' },
                       { k: 'boneMass', l: 'Massa Óssea (kg)', c: 'text-gray-400', u: 'kg' },
                       { k: 'protein', l: 'Proteína (%)', c: 'text-purple-400', u: '%' },
                       { k: 'bmr', l: 'TMB (kcal)', c: 'text-pink-500', u: 'kcal' },
                       { k: 'metabolicAge', l: 'Idade Metabólica', c: 'text-yellow-500', u: 'anos' },
                     ].map(m => (
                       <div key={m.k} className="flex flex-col border-b border-white/5 pb-4 group">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-blue-400 transition-colors">{m.l}</label>
                         <div className="relative flex items-center">
                           <input 
                             type="number" 
                             disabled={viewMode === 'aluno'}
                             className={`bg-transparent outline-none text-2xl font-black italic ${m.c} border-none p-0 disabled:opacity-80 disabled:cursor-not-allowed w-full pr-8`} 
                             value={(bio as any)[m.k]} 
                             onChange={e => setBio({...bio, [m.k]: e.target.value})} 
                             placeholder="0.0" 
                           />
                           {viewMode !== 'aluno' && <div className="absolute right-0"><VoiceInputButton onResult={(val) => setBio({...bio, [m.k]: val})} /></div>}
                         </div>
                         {(bio as any)[m.k] && m.k !== 'fatFreeMass' && m.k !== 'subcutaneousFat' && m.k !== 'skeletalMuscle' && m.k !== 'muscleMass' && m.k !== 'metabolicAge' && (
                           <ReferenceRuler 
                             value={parseFloat((bio as any)[m.k]) || 0} 
                             min={getMinMax(m.k)[0]} 
                             max={getMinMax(m.k)[1]} 
                             idealRange={getIdealRange(m.k, formData.sex)} 
                             unit={m.u} 
                           />
                         )}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Dashboard de Prescrição Baseado na Bioimpedância */}
                <div className="lg:col-span-8 space-y-12">
                   {/* Linha de Destaque Fisiológico */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="glass-card p-10 rounded-[48px] border-blue-500/20 flex flex-col items-center justify-center text-center">
                         <Droplets className="text-cyan-400 mb-4" size={32} />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ingestão Hídrica</span>
                         <span className="text-5xl font-black italic text-white">{technicalAnalyses.water}<span className="text-sm ml-1 opacity-40">L/dia</span></span>
                      </div>
                      <div className="glass-card p-10 rounded-[48px] border-neon/20 flex flex-col items-center justify-center text-center">
                         <Power className="text-neon mb-4" size={32} />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Metabolismo Total (TDEE)</span>
                         <span className="text-5xl font-black italic text-white">{technicalAnalyses.calories}<span className="text-sm ml-1 opacity-40">kcal</span></span>
                      </div>
                      <div className="glass-card p-10 rounded-[48px] border-red-500/20 flex flex-col items-center justify-center text-center">
                         <TrendingDown className="text-red-500 mb-4" size={32} />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gordura a Eliminar</span>
                         <span className="text-5xl font-black italic text-red-500">{technicalAnalyses.toLose}<span className="text-sm ml-1 opacity-40 text-white">kg</span></span>
                      </div>
                   </div>

                   {/* Dashboard de Nutrientes Estratégicos */}
                   <div className="glass-card p-12 rounded-[64px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                      <h3 className="text-white text-[12px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                        <Utensils size={18} className="text-blue-500"/> Alvos de Macronutrientes por Dia
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         <div className="space-y-6">
                            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                               <span className="text-[11px] font-black text-gray-400 uppercase">Proteína</span>
                               <span className="text-3xl font-black italic text-white">{technicalAnalyses.macros.p}g</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: '100%' }}></div>
                            </div>
                         </div>
                         
                         <div className="space-y-6">
                            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                               <span className="text-[11px] font-black text-gray-400 uppercase">Carboidrato</span>
                               <span className="text-3xl font-black italic text-white">{technicalAnalyses.macros.c}g</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '100%' }}></div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                               <span className="text-[11px] font-black text-gray-400 uppercase">Lipídeos</span>
                               <span className="text-3xl font-black italic text-white">{technicalAnalyses.macros.f}g</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: '100%' }}></div>
                            </div>
                         </div>
                      </div>
                      <p className="mt-12 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Cálculo baseado em 2.2g Prot / 0.8g Gord / Saldo em Carbo</p>
                   </div>

                   {/* Recomendação Biomecânica de Exercício */}
                   <div className="glass-card p-12 rounded-[64px] border-blue-500/30 bg-blue-500/5 flex flex-col md:flex-row items-center gap-12">
                      <div className="flex-1 space-y-6">
                         <div className="flex items-center gap-3">
                            <Stethoscope size={24} className="text-blue-400" />
                            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">Encaminhamento <span className="text-blue-500">Clínico</span></h3>
                         </div>
                         <div className="p-6 bg-dark/40 rounded-3xl border border-white/5">
                            <p className="text-gray-300 text-sm leading-relaxed">
                               Estratégia Recomendada: <span className="text-blue-400 font-black uppercase">{technicalAnalyses.recommendation}</span>.<br/>
                               Devido ao nível de Gordura Visceral ({bio.visceralFat || '0'}) e TMB de {technicalAnalyses.calories} kcal, é imperativo manter a ingestão de {technicalAnalyses.macros.p}g de proteína para preservar a Massa Livre de Gordura ({bio.fatFreeMass || '0'} kg).
                            </p>
                         </div>
                      </div>
                      <div className="bg-dark/80 p-12 rounded-[56px] border border-blue-500/20 flex flex-col items-center text-center min-w-[280px] shadow-2xl">
                         <Flame size={48} className="text-orange-500 mb-6 animate-pulse" />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Ideal Gasto Extra/Dia (Exercício)</span>
                         <span className="text-6xl font-black italic text-white">{technicalAnalyses.exerciseTarget}<span className="text-xs ml-1 opacity-30">kcal</span></span>
                         <div className="mt-6 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Bioimpedância" 
                studentName={formData.name} 
                data={{ bio }} 
                onExportPdf={() => handleExportImage(bioReportRef, 'Laudo-Bioimpedancia-Profissional', 'pdf')} 
              />
            </div>
          )}

          {/* SETUP / CADASTRO - GESTÃO DE ALUNOS */}
          {activeTab === 'setup' && viewMode === 'avaliador' && (
            <div ref={setupReportRef} className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Gestão de<br/><span className="text-neon">Alunos</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Base de Dados e Histórico de Performance</p>
                </div>
                <button onClick={openAddStudent} className="px-10 py-6 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon">
                  <UserPlus size={22} /> Novo Aluno
                </button>
              </div>

              <div className="glass-card p-8 rounded-[40px] border-white/5">
                <div className="relative mb-8">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="BUSCAR ALUNO POR NOME..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white font-bold outline-none focus:border-neon transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="glass-card p-8 rounded-3xl border-white/5 hover:border-neon/30 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-dark transition-all">
                          <User size={28} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditStudent(student)} className="p-2 text-gray-500 hover:text-neon transition-colors"><Edit size={18}/></button>
                          <button onClick={() => deleteStudent(student.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-1">{student.name}</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">{student.objective}</p>
                      
                      <div className="flex gap-2">
                        <button onClick={() => {
                          startNewEvaluation(student);
                        }} className="flex-1 py-3 bg-neon text-dark rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105">Nova Avaliação</button>
                        <button onClick={() => {
                          loadStudent(student);
                          setActiveTab('anamnese');
                        }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Continuar</button>
                        <button onClick={() => {
                          setSelectedStudentId(student.id);
                          setActiveTab('comparativos');
                        }} className="flex-1 py-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Evolução</button>
                      </div>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-gray-500 font-bold uppercase tracking-widest">Nenhum aluno encontrado.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end pt-8 border-t border-white/5">
                <button onClick={handleSaveEvaluation} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon">
                  <Save size={20} /> Salvar Avaliação
                </button>
              </div>
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Cadastro e Gestão" 
                studentName={formData.name} 
                data={{ formData }} 
                onExportPdf={() => handleExportImage(setupReportRef, 'Cadastro-Aluno', 'pdf')} 
              />
            </div>
          )}

          {/* ANAMNESE */}
          {activeTab === 'anamnese' && (
            <div ref={anamneseReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Anamnese<br/><span className="text-neon">Detalhada</span></h1>
                    <p className="text-gray-500 text-sm mt-6 font-bold tracking-widest md:tracking-[0.6em] uppercase">Mapeamento de Saúde & Prontidão</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {viewMode === 'avaliador' && (
                      <button onClick={handleSaveEvaluation} className="px-8 md:px-10 py-4 md:py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon w-full sm:w-auto justify-center"><Save size={20} /> Salvar Avaliação</button>
                    )}
                    <button onClick={() => {
                      const reportElement = document.getElementById('detailed-report');
                      if (reportElement) {
                        handleExportImage({ current: reportElement as HTMLDivElement }, 'Relatorio-Anamnese-Detalhado', 'pdf');
                      } else {
                        handleExportImage(anamneseReportRef, 'Relatorio-Anamnese-360', 'pdf');
                      }
                    }} className="px-10 py-5 bg-white text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-neon transition-all"><Download size={20} /> Exportar Anamnese (PDF)</button>
                  </div>
               </div>

               {/* DADOS ANTROPOMÉTRICOS DE BASE (MOVIDO DO SETUP) */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 <div className="glass-card p-12 rounded-[56px] space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-neon"><User size={20}/></div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Identificação do Aluno</h3>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-neon uppercase tracking-widest">Nome Completo</label>
                       <div className="w-full border-b-2 border-white/10 p-4 font-black text-2xl text-white">{formData.name || 'SELECIONE UM ALUNO'}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-neon uppercase tracking-widest">Data Nasc.</label>
                        <div className="w-full border-b-2 border-white/10 p-4 font-black text-xl text-white">{formData.birthDate || '--/--/----'}</div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Idade Calc.</label>
                        <div className="w-full p-4 font-black text-3xl text-neon border-b-2 border-white/10">{formData.age || '0'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Peso (kg)</label>
                         <div className="relative flex items-center">
                           <input type="number" step="any" disabled={viewMode === 'aluno'} className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-3xl outline-none disabled:opacity-50" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                           {viewMode !== 'aluno' && <div className="absolute right-2"><VoiceInputButton onResult={(val) => setFormData({...formData, weight: val})} /></div>}
                         </div>
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Altura (cm)</label>
                         <div className="relative flex items-center">
                           <input type="number" step="any" disabled={viewMode === 'aluno'} className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-3xl outline-none disabled:opacity-50" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                           {viewMode !== 'aluno' && <div className="absolute right-2"><VoiceInputButton onResult={(val) => setFormData({...formData, height: val})} /></div>}
                         </div>
                       </div>
                       <div className="space-y-4"><label className="text-[10px] font-black opacity-40 uppercase tracking-widest">IMC</label><div className="w-full p-4 font-black text-3xl text-blue-400">{computedBMI}</div></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Pressão Arterial</label>
                         <div className="relative flex items-center">
                           <input 
                             type="text" 
                             disabled={viewMode === 'aluno'} 
                             className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none disabled:opacity-50 pr-10" 
                             value={formData.bloodPressure} 
                             onChange={e => {
                               let val = e.target.value.replace(/\D/g, '');
                                if (val.length === 5) {
                                  val = val.slice(0, 3) + '/' + val.slice(3, 5);
                                } else if (val.length === 4) {
                                  if (['1', '2'].includes(val[0])) {
                                    val = val.slice(0, 3) + '/' + val.slice(3, 4);
                                  } else {
                                    val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                  }
                                } else if (val.length === 3) {
                                  if (['1', '2'].includes(val[0])) {
                                    val = val.slice(0, 3);
                                  } else {
                                    val = val.slice(0, 2) + '/' + val.slice(2, 3);
                                  }
                                }
                               setFormData({...formData, bloodPressure: val});
                             }} 
                             placeholder="120/80" 
                           />
                           {viewMode !== 'aluno' && <div className="absolute right-2"><VoiceInputButton isNumber={false} onResult={(val) => {
                             let formatted = val.replace(/\D/g, '');
                             if (formatted.length === 5) {
                               formatted = formatted.slice(0, 3) + '/' + formatted.slice(3, 5);
                             } else if (formatted.length === 4) {
                               if (['1', '2'].includes(formatted[0])) {
                                 formatted = formatted.slice(0, 3) + '/' + formatted.slice(3, 4);
                               } else {
                                 formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                               }
                             } else if (formatted.length === 3) {
                               if (['1', '2'].includes(formatted[0])) {
                                 formatted = formatted.slice(0, 3);
                               } else {
                                 formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 3);
                               }
                             }
                             setFormData({...formData, bloodPressure: formatted});
                           }} /></div>}
                         </div>
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Oxímetro (%)</label>
                         <div className="relative flex items-center">
                           <input type="number" step="any" disabled={viewMode === 'aluno'} className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none disabled:opacity-50" value={formData.oximetry} onChange={e => setFormData({...formData, oximetry: e.target.value})} placeholder="98" />
                           {viewMode !== 'aluno' && <div className="absolute right-2"><VoiceInputButton onResult={(val) => setFormData({...formData, oximetry: val})} /></div>}
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="glass-card p-12 rounded-[56px] space-y-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Target size={20}/></div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Metas Estratégicas</h3>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-neon uppercase tracking-widest">Objetivo Estratégico</label>
                      <div className="grid grid-cols-2 gap-4">
                        {OBJECTIVES.map(obj => (
                          <button key={obj} disabled={viewMode === 'aluno'} onClick={() => setFormData({...formData, objective: obj})} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.objective === obj ? 'bg-neon text-dark border-neon shadow-neon' : 'border-white/5 text-gray-500 hover:border-white/20'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {obj}
                          </button>
                        ))}
                      </div>
                    </div>
                    <WeightGoalsPanel 
                      weight={formData.weight}
                      height={formData.height}
                      sex={formData.sex}
                      objective={formData.objective}
                    />
                 </div>
               </div>

               <AnamnesisDashboard 
                 data={formData.anamnesisData} 
                 onChange={(newData) => setFormData({ ...formData, anamnesisData: newData })} 
                 studentName={formData.name} 
                 viewMode={viewMode}
               />

                <div className="glass-card p-12 rounded-[56px] space-y-12">
                   <div className="flex items-center justify-between">
                      <h3 className="text-neon text-[12px] font-black uppercase tracking-[0.5em] flex items-center gap-4"><ClipboardCheck size={20}/> Anamnese & PAR-Q</h3>
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 ${isAptoParaTestes.color}`}>
                          {isAptoParaTestes.icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">{isAptoParaTestes.status}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Questionário de Prontidão (PAR-Q)</label>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                          {PARQ_QUESTIONS.map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                              <span className="text-[11px] font-bold text-gray-400 leading-tight group-hover:text-white transition-colors max-w-[80%]">{q}</span>
                              <button 
                                onClick={() => {
                                  if (viewMode === 'aluno') return;
                                  const newAns = [...formData.parQAnswers];
                                  newAns[idx] = !newAns[idx];
                                  setFormData({...formData, parQAnswers: newAns});
                                }} 
                                disabled={viewMode === 'aluno'}
                                className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${formData.parQAnswers[idx] ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10'} ${viewMode === 'aluno' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${formData.parQAnswers[idx] ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Já Treina Atualmente?</label>
                           <div className="flex gap-4">
                              {['Sim', 'Não'].map(opt => (
                                <button key={opt} onClick={() => { if (viewMode !== 'aluno') setFormData({...formData, isTraining: opt === 'Sim'}) }} disabled={viewMode === 'aluno'} className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${ (opt === 'Sim' && formData.isTraining) || (opt === 'Não' && !formData.isTraining) ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/20'} ${viewMode === 'aluno' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                  {opt}
                                </button>
                              ))}
                           </div>
                        </div>

                        {formData.isTraining && (
                          <div className="space-y-6 animate-fade-in">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nível de Treino</label>
                             <div className="flex flex-col gap-3">
                                {[
                                  { level: 'Iniciante', desc: 'Menos de 6 meses de treino consistente' },
                                  { level: 'Intermediário', desc: 'De 6 meses a 2 anos de treino consistente' },
                                  { level: 'Avançado', desc: 'Mais de 2 anos de treino consistente' }
                                ].map(opt => (
                                  <button 
                                    key={opt.level} 
                                    onClick={() => { if (viewMode !== 'aluno') setFormData({...formData, trainingLevel: opt.level}) }} 
                                    disabled={viewMode === 'aluno'} 
                                    className={`w-full p-4 rounded-2xl text-left border transition-all ${ formData.trainingLevel === opt.level ? 'bg-neon/10 border-neon text-white shadow-[inset_0_0_15px_rgba(57,255,20,0.1)]' : 'border-white/10 text-gray-400 hover:border-white/20'} ${viewMode === 'aluno' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <div className="font-black uppercase tracking-widest text-xs mb-1">{opt.level}</div>
                                    <div className="text-[10px] text-gray-500">{opt.desc}</div>
                                  </button>
                                ))}
                             </div>
                          </div>
                        )}

                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Horário Habitual de Treino</label>
                           <input 
                             type="time" 
                             disabled={viewMode === 'aluno'} 
                             className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none focus:border-neon transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                             value={formData.trainingTime} 
                             onChange={e => setFormData({...formData, trainingTime: e.target.value})} 
                           />
                           <p className="text-xs text-gray-500">Isso ajuda a IA a ajustar o horário da refeição pré-treino.</p>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Possíveis Lesões / Dores</label>
                           <textarea disabled={viewMode === 'aluno'} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-neon transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" value={formData.injuries} onChange={e => setFormData({...formData, injuries: e.target.value})} placeholder="Descreva lesões prévias ou dores articulares..." />
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alimentação / Dieta</label>
                           <textarea disabled={viewMode === 'aluno'} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-neon transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" value={formData.dietType} onChange={e => setFormData({...formData, dietType: e.target.value})} placeholder="Descreva o padrão alimentar atual..." />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nível de Esforço Diário (0-10)</label>
                          <span className="text-2xl font-black text-neon italic">{formData.dailyEffort}</span>
                       </div>
                       <input type="range" min="0" max="10" disabled={viewMode === 'aluno'} className="w-full accent-neon disabled:opacity-50 disabled:cursor-not-allowed" value={formData.dailyEffort} onChange={e => setFormData({...formData, dailyEffort: parseInt(e.target.value)})} />
                       <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                          <span>Sedentário</span>
                          <span>Moderado</span>
                          <span>Extremo</span>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload de Laudos / Documentos</label>
                       <div className="flex flex-col gap-4">
                        <label className={`w-full h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all group ${viewMode === 'aluno' ? 'opacity-50 cursor-not-allowed' : 'hover:border-neon/30 cursor-pointer'}`}>
                            <input type="file" multiple disabled={viewMode === 'aluno'} className="hidden" onChange={handleDocUpload} />
                            <FileText className="text-gray-600 group-hover:text-neon transition-colors" size={32} />
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                              {formData.medicalReports.length > 0 ? `${formData.medicalReports.length} Arquivos Anexados` : 'Arraste ou clique para anexar'}
                            </span>
                        </label>
                        {formData.medicalReports.length > 0 && viewMode === 'avaliador' && (
                          <button onClick={handleAnalyzeDocs} disabled={loadingDocs} className="py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                            {loadingDocs ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />} Analisar Documentos com IA
                          </button>
                        )}
                       </div>
                    </div>
                  </div>

                  {docAnalysisResult && (
                    <div className="p-10 bg-blue-600/10 border border-blue-500/20 rounded-[40px] animate-in fade-in zoom-in duration-500">
                      <div className="flex items-center gap-4 mb-6">
                        <ShieldCheck className="text-blue-400" size={24} />
                        <h4 className="text-lg font-black uppercase tracking-widest">Parecer Técnico de Documentos</h4>
                      </div>
                      <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {docAnalysisResult}
                      </div>
                    </div>
                  )}

                </div>
                <IntelligentReport 
                  trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                  viewMode={viewMode}
                  tabName="Anamnese" 
                  studentName={formData.name} 
                  data={{ formData }} 
                  onExportPdf={() => handleExportImage(anamneseReportRef, 'Laudo-Anamnese-360', 'pdf')} 
                />
             </div>
          )}

          {/* COMPARATIVOS */}
          {activeTab === 'comparativos' && (
            <div ref={comparativosReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Comparativos<br/><span className="text-neon">Evolutivos</span></h1>
                    <p className="text-gray-500 text-sm mt-6 font-bold tracking-widest md:tracking-[0.6em] uppercase">Análise de Progresso & Resultados</p>
                  </div>
                  <button onClick={() => handleExportImage(comparativosReportRef, 'Relatorio-Evolucao-360', 'pdf')} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon"><Download size={20} /> Exportar Evolução (PDF)</button>
               </div>

               <ComparisonsDashboard 
                 evaluations={evaluations.filter(e => e.studentId === selectedStudentId)} 
                 student={students.find(s => s.id === selectedStudentId)} 
               />

               <div className="flex justify-end pt-8 border-t border-white/5">
                 {viewMode === 'avaliador' && (
                   <button onClick={handleSaveEvaluation} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon">
                     <Save size={20} /> Salvar Avaliação
                   </button>
                 )}
               </div>
               <IntelligentReport 
                  trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                  viewMode={viewMode}
                  tabName="Comparativos" 
                  studentName={formData.name} 
                  data={{ evaluations: evaluations.filter(e => e.studentId === selectedStudentId) }} 
                  onExportPdf={() => handleExportImage(comparativosReportRef, 'Relatorio-Evolucao-360', 'pdf')} 
                />
            </div>
          )}

          {/* DOBRAS CUTÂNEAS DASHBOARD */}
          {activeTab === 'skinfolds' && (
            <div ref={skinfoldsReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Dobras<br/><span className="text-neon">Cutâneas</span></h1>
                  <p className="text-gray-500 text-sm mt-6 font-bold tracking-widest md:tracking-[0.6em] uppercase">Avaliação Antropométrica & Dash Prescritivo</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setShowSkinfoldsHelp(!showSkinfoldsHelp)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <HelpCircle size={20} /> Como Fazer
                  </button>
                  <button onClick={() => handleExportImage(skinfoldsReportRef, 'Laudo-Completo-Dobras-360', 'pdf')} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-neon">
                    <Download size={20} /> Exportar Laudo Prescritivo (PDF)
                  </button>
                </div>
              </div>

              {showSkinfoldsHelp && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4 animate-scale-in">
                  <h3 className="text-neon font-black uppercase tracking-widest text-sm">Instruções: Dobras Cutâneas</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li>Sempre realize as medidas no lado direito do corpo do aluno.</li>
                    <li>Marque o local exato com um lápis demográfico antes de pinçar.</li>
                    <li>Pinçe a pele e o tecido subcutâneo firmemente com o polegar e o indicador, cerca de 1 cm acima do local marcado.</li>
                    <li>Aplique o adipômetro no local marcado e leia o valor em milímetros após 2 segundos.</li>
                    <li>Realize 3 medidas não consecutivas em cada ponto e use a média.</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Inputs de Medidas */}
                {viewMode === 'avaliador' && (
                  <div className="lg:col-span-4 glass-card p-10 rounded-[56px] space-y-8 border-white/5">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-neon uppercase tracking-widest">Perfil do Aluno</label>
                        <select 
                          className="w-full bg-dark border-b-2 border-white/10 p-4 font-black text-sm outline-none focus:border-neon transition-all text-white"
                          value={skinfoldProfile}
                          onChange={e => setSkinfoldProfile(e.target.value)}
                        >
                          {['Sedentário adulto', 'Atleta', 'Obeso', 'Idoso', 'Criança / Adolescente', 'Mulher (Pollock 4 dobras)', 'Mulher (Guedes 3 dobras)'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <div className="mt-6 p-5 bg-white/5 rounded-3xl border border-white/10">
                          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Protocolo Automático</div>
                          <div className="text-sm font-bold text-neon mb-2">{skinfoldProtocol}</div>
                          <div className="text-xs text-gray-400 italic leading-relaxed">
                            {skinfoldProtocol === 'Jackson & Pollock – 3 dobras' && (formData.sex === 'F' ? 'Indicado para mulheres não atletas. Utiliza Tríceps, Suprailíaca e Coxa (Jackson, Pollock & Ward).' : 'Indicado para adultos não atletas e população em geral. Oferece boa precisão com menos medidas.')}
                            {skinfoldProtocol === 'Jackson & Pollock – 7 dobras' && 'Indicado para atletas e indivíduos fisicamente ativos. Maior precisão na distribuição de gordura corporal.'}
                            {skinfoldProtocol === 'Durnin & Womersley – 4 dobras' && 'Indicado para idosos e indivíduos obesos ou com sobrepeso. Foca em dobras superiores e tronco.'}
                            {skinfoldProtocol === 'Slaughter – 2 dobras' && 'Indicado para crianças e adolescentes (8 a 18 anos). Método não invasivo e validado para esta faixa etária.'}
                            {skinfoldProtocol === 'Pollock – 4 dobras (Mulheres)' && 'Protocolo específico para mulheres (Jackson, Pollock & Ward). Utiliza Tríceps, Suprailíaca, Abdominal e Coxa para maior precisão no público feminino.'}
                            {skinfoldProtocol === 'Guedes – 3 dobras (Mulheres)' && 'Protocolo brasileiro (Guedes) validado para mulheres. Utiliza Coxa, Suprailíaca e Subescapular.'}
                          </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                       {Object.keys(folds).map(f => (
                         <div key={f} className="flex flex-col border-b border-white/5 pb-3">
                           <div className="flex items-center justify-between">
                             <div className="flex flex-col">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f}</label>
                                {requiredFolds.includes(f) && <span className="text-[8px] text-neon font-black uppercase">Obrigatória</span>}
                             </div>
                             <div className="relative flex items-center">
                               <input type="number" step="any" className="bg-transparent border-b border-white/20 outline-none w-20 text-right text-xl font-black text-white focus:border-neon pr-8" value={(folds as any)[f]} onChange={e => setFolds({...folds, [f]: e.target.value})} placeholder="0" />
                               <div className="absolute right-0"><VoiceInputButton onResult={(val) => setFolds({...folds, [f]: val})} /></div>
                             </div>
                           </div>
                           {(folds as any)[f] && (
                             <ReferenceRuler 
                               value={parseFloat((folds as any)[f]) || 0} 
                               min={getMinMax(f)[0]} 
                               max={getMinMax(f)[1]} 
                               idealRange={getIdealRange(f, formData.sex)} 
                               unit="mm" 
                             />
                           )}
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                {/* Dashboard Simplificado */}
                <div className={`${viewMode === 'avaliador' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-12`}>
                   <SkinfoldBodyMap folds={folds} setFolds={setFolds} gender={formData.sex} viewMode={viewMode} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="glass-card p-10 rounded-[48px] border-neon/20 flex flex-col items-center justify-center text-center">
                         <Droplets className="text-blue-400 mb-4" size={32} />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Água Recomendada</span>
                         <span className="text-4xl font-black italic text-white">{technicalAnalyses.water} L</span>
                      </div>
                      <div className="glass-card p-10 rounded-[48px] border-neon/20 flex flex-col items-center justify-center text-center">
                         <TrendingDown className="text-red-500 mb-4" size={32} />
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gordura Excedente</span>
                         <span className="text-4xl font-black italic text-white">{technicalAnalyses.toLose} kg</span>
                      </div>
                   </div>
                   <div className="glass-card p-12 rounded-[56px] border-white/5 flex items-center justify-center">
                      <p className="text-gray-400 text-sm text-center italic">Para detalhamento nutricional completo, consulte a aba <span className="text-blue-400 font-black">Bioimpedância</span>.</p>
                   </div>
                </div>
              </div>
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Dobras Cutâneas" 
                studentName={formData.name} 
                data={{ folds }} 
                onExportPdf={() => handleExportImage(skinfoldsReportRef, 'Laudo-Completo-Dobras-360', 'pdf')} 
              />
            </div>
          )}

          {/* PERIMETRIA */}
          {activeTab === 'perimetry' && (
            <div ref={perimetryReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                <div className="w-full overflow-hidden"><h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Perimetria & <br/><span className="text-neon">Simetria</span></h1><p className="text-gray-500 text-sm mt-6 font-bold tracking-widest md:tracking-[0.6em] uppercase">Avaliação de Desequilíbrios Musculares</p></div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setShowPerimetryHelp(!showPerimetryHelp)} className="px-8 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <HelpCircle size={16} /> Como Fazer
                  </button>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => handleExportImage(perimetryReportRef, 'Laudo-Perimetria-360', 'png')} className="px-8 py-5 bg-white/5 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10 w-full sm:w-auto justify-center"><Download size={16} /> PNG</button>
                    <button onClick={() => handleExportImage(perimetryReportRef, 'Laudo-Perimetria-360', 'pdf')} className="px-8 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-neon w-full sm:w-auto justify-center"><FileDown size={16} /> PDF</button>
                  </div>
                </div>
              </div>

              {showPerimetryHelp && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4 animate-scale-in">
                  <h3 className="text-neon font-black uppercase tracking-widest text-sm">Instruções: Perimetria</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li>Use uma fita métrica inelástica e flexível.</li>
                    <li>A fita deve estar ajustada à pele, sem comprimir o tecido subcutâneo.</li>
                    <li>O aluno deve estar relaxado, com os braços ao longo do corpo (exceto quando indicado o contrário).</li>
                    <li>Meça sempre no plano horizontal, perpendicular ao eixo longitudinal do segmento.</li>
                    <li>Para medidas bilaterais (braços, pernas), meça sempre ambos os lados para avaliar a simetria.</li>
                  </ul>
                </div>
              )}

              {viewMode === 'avaliador' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-white/5">
                  <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><TargetIcon size={18}/> Musculatura Bilateral (D vs E)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[ { k: 'armRelaxed', l: 'Braço Relaxado' }, { k: 'forearm', l: 'Antebraço' }, { k: 'thighMedial', l: 'Coxa Medial' }, { k: 'calf', l: 'Panturrilha' } ].map(item => (
                      <React.Fragment key={item.k}>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase">{item.l} (D)</label>
                          <div className="relative flex items-center">
                            <input type="number" step="any" className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl pr-10" value={(perimetry as any)[`${item.k}R`]} onChange={e => setPerimetry({...perimetry, [`${item.k}R`]: e.target.value})} />
                            <div className="absolute right-2"><VoiceInputButton onResult={(val) => setPerimetry({...perimetry, [`${item.k}R`]: val})} /></div>
                          </div>
                          {(perimetry as any)[`${item.k}R`] && <ReferenceRuler value={parseFloat((perimetry as any)[`${item.k}R`]) || 0} min={getMinMax(`${item.k}R`)[0]} max={getMinMax(`${item.k}R`)[1]} idealRange={getIdealRange(`${item.k}R`, formData.sex)} unit="cm" />}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase">{item.l} (E)</label>
                          <div className="relative flex items-center">
                            <input type="number" step="any" className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl pr-10" value={(perimetry as any)[`${item.k}L`]} onChange={e => setPerimetry({...perimetry, [`${item.k}L`]: e.target.value})} />
                            <div className="absolute right-2"><VoiceInputButton onResult={(val) => setPerimetry({...perimetry, [`${item.k}L`]: val})} /></div>
                          </div>
                          {(perimetry as any)[`${item.k}L`] && <ReferenceRuler value={parseFloat((perimetry as any)[`${item.k}L`]) || 0} min={getMinMax(`${item.k}L`)[0]} max={getMinMax(`${item.k}L`)[1]} idealRange={getIdealRange(`${item.k}L`, formData.sex)} unit="cm" />}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-16">
                  <div className="glass-card p-10 rounded-[48px] border-white/5">
                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10 text-center">Circunferências de Tronco</h3>
                    <div className="space-y-8">
                      {['neck', 'shoulder', 'thorax', 'waist', 'abdomen', 'hip'].map(k => (
                        <div key={k} className="space-y-2">
                          <label className="text-[9px] font-black text-neon uppercase tracking-widest">{k === 'neck' ? 'Pescoço' : k === 'shoulder' ? 'Ombros' : k === 'thorax' ? 'Tórax' : k === 'waist' ? 'Cintura' : k === 'abdomen' ? 'Abdomen' : 'Quadril'}</label>
                          <div className="relative flex items-center">
                            <input type="number" step="any" className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl pr-10" value={(perimetry as any)[k]} onChange={e => setPerimetry({...perimetry, [k]: e.target.value})} />
                            <div className="absolute right-2"><VoiceInputButton onResult={(val) => setPerimetry({...perimetry, [k]: val})} /></div>
                          </div>
                          {(perimetry as any)[k] && <ReferenceRuler value={parseFloat((perimetry as any)[k]) || 0} min={getMinMax(k)[0]} max={getMinMax(k)[1]} idealRange={getIdealRange(k, formData.sex)} unit="cm" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[48px] border-white/5">
                    <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10 text-center">Diâmetros Ósseos (Parquímetro)</h3>
                    <div className="space-y-8">
                      {[
                        { k: 'biacromial', l: 'Biacromial (Ombros)' },
                        { k: 'bicristal', l: 'Bicristal (Quadril)' },
                        { k: 'wrist', l: 'Punho' },
                        { k: 'elbow', l: 'Cotovelo' },
                        { k: 'femur', l: 'Fêmur (Joelho)' },
                        { k: 'ankle', l: 'Tornozelo' }
                      ].map(item => (
                        <div key={item.k} className="space-y-2">
                          <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{item.l}</label>
                          <div className="relative flex items-center">
                            <input type="number" step="any" className="w-full bg-white/5 border-b-2 border-white/10 p-4 font-black text-xl pr-10" value={(perimetry as any)[item.k]} onChange={e => setPerimetry({...perimetry, [item.k]: e.target.value})} />
                            <div className="absolute right-2"><VoiceInputButton onResult={(val) => setPerimetry({...perimetry, [item.k]: val})} /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Mapa de Calor */}
              <div className="animate-in slide-in-from-bottom-5 duration-500 delay-100">
                <BodyHeatmap perimetry={perimetry} sex={formData.sex} />
              </div>

              {/* Resumo Animado de Índices */}
              <div className="glass-card p-12 rounded-[56px] border-white/5 animate-in slide-in-from-bottom-5 duration-500">
                <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><Activity size={18}/> Resumo de Proporções & Simetria</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'RCQ (Risco)', value: perimetryIndices.rcq, ideal: '< 0.90' },
                    { label: 'WHtR (Risco)', value: perimetryIndices.whtr, ideal: '< 0.50' },
                    { label: 'Ombro/Cintura (V-Taper)', value: perimetryIndices.shoulderWaist, ideal: '> 1.6' },
                    { label: 'Peito/Cintura', value: perimetryIndices.chestWaist, ideal: '> 1.4' },
                    { label: 'Braço/Peito', value: perimetryIndices.armChest, ideal: '~ 0.36' },
                    { label: 'Coxa/Cintura', value: perimetryIndices.thighWaist, ideal: '> 0.75' },
                    { label: 'Braço/Panturrilha (Simetria)', value: perimetryIndices.armCalfSym, ideal: '~ 1.0' },
                    { label: 'Peito/Coxa', value: perimetryIndices.chestThigh, ideal: '~ 1.7' }
                  ].map((idx, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all group">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">{idx.label}</span>
                      <span className="text-3xl font-black italic text-white group-hover:text-neon transition-colors">{idx.value}</span>
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-2">Ideal: {idx.ideal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-12">
                {viewMode === 'avaliador' && (
                  <button 
                    onClick={() => handleGenerateAIAnalysis('perimetry')} 
                    disabled={loadingAnalysis} 
                    className="px-16 py-8 bg-neon text-dark rounded-[40px] font-black uppercase tracking-[0.4em] shadow-neon flex items-center gap-6 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loadingAnalysis ? <Loader2 className="animate-spin" size={24} /> : <BrainCircuit size={24} />} Gerar Análise Antropométrica Profissional
                  </button>
                )}

                {perimetryAnalysisResult && (
                  <div className="w-full glass-card p-16 rounded-[56px] border-neon/20 animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-between items-center mb-12">
                      <div className="flex items-center gap-4">
                        <FileText className="text-neon" size={28} />
                        <h3 className="text-2xl font-black uppercase tracking-widest text-white">Laudo Antropométrico {trainerName}</h3>
                      </div>
                      <button onClick={() => handleExportImage(perimetryReportRef, 'Laudo-Antropometrico-360')} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><Download size={20} /></button>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                      {perimetryAnalysisResult}
                    </div>
                  </div>
                )}
              </div>
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Perimetria" 
                studentName={formData.name} 
                data={{ perimetry }} 
                onExportPdf={() => handleExportImage(perimetryReportRef, 'Laudo-Perimetria-360', 'pdf')} 
              />
            </div>
          )}

          {/* DINAMOMETRIA */}
          {activeTab === 'dinamometria' && (
            <div ref={dynamometryReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Dinamometria<br/><span className="text-neon">Avançada</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Análise de Desempenho Neuromuscular</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setShowDynamometryHelp(!showDynamometryHelp)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <HelpCircle size={20} /> Como Fazer
                  </button>
                  <div className="flex flex-wrap gap-4">
                    {viewMode === 'avaliador' && (
                      <button onClick={() => handleGenerateAIAnalysis('dynamometry')} disabled={loadingAnalysis} className="px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3 hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50 w-full sm:w-auto justify-center">
                        {loadingAnalysis ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />} Gerar Laudo IA
                      </button>
                    )}
                    <button onClick={() => handleExportImage(dynamometryReportRef, 'Laudo-Dinamometria-360', 'pdf')} className="px-8 md:px-10 py-4 md:py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon w-full sm:w-auto justify-center">
                      <Download size={20} /> Exportar Laudo (PDF)
                    </button>
                  </div>
                </div>
              </div>

              {showDynamometryHelp && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4 animate-scale-in">
                  <h3 className="text-neon font-black uppercase tracking-widest text-sm">Instruções: Dinamometria</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                    <li><strong>Preensão Manual:</strong> O aluno deve estar em pé, com o braço estendido ao longo do corpo. O dinamômetro não deve tocar o corpo. Apertar com força máxima por 3 a 5 segundos.</li>
                    <li><strong>Dorsal:</strong> O aluno fica em pé sobre a base do dinamômetro, joelhos estendidos, tronco flexionado a cerca de 30 graus. Puxar a barra para cima usando a musculatura das costas.</li>
                    <li><strong>Pernas:</strong> O aluno fica em pé sobre a base, joelhos flexionados a cerca de 130-140 graus, tronco ereto. Empurrar estendendo os joelhos.</li>
                    <li>Realize 3 tentativas para cada teste, com 1 minuto de descanso entre elas, e registre o maior valor.</li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Inputs */}
                {viewMode === 'avaliador' && (
                <div className="lg:col-span-1 space-y-8">
                  <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6">
                    <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4"><Activity size={18}/> Hand Grip (kgf)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase">Direito</label>
                        <div className="relative flex items-center mt-2">
                          <input type="number" step="any" value={dynamometry.handGripRight} onChange={e => setDynamometry({...dynamometry, handGripRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all pr-10" placeholder="0" />
                          <div className="absolute right-2"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, handGripRight: val})} /></div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase">Esquerdo</label>
                        <div className="relative flex items-center mt-2">
                          <input type="number" step="any" value={dynamometry.handGripLeft} onChange={e => setDynamometry({...dynamometry, handGripLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all pr-10" placeholder="0" />
                          <div className="absolute right-2"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, handGripLeft: val})} /></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6">
                    <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4"><Target size={18}/> Cargas (kg)</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Bíceps</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.bicepsRight} onChange={e => setDynamometry({...dynamometry, bicepsRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, bicepsRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.bicepsLeft} onChange={e => setDynamometry({...dynamometry, bicepsLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, bicepsLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Tríceps</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.tricepsRight} onChange={e => setDynamometry({...dynamometry, tricepsRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, tricepsRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.tricepsLeft} onChange={e => setDynamometry({...dynamometry, tricepsLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, tricepsLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Supino</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.benchPressRight} onChange={e => setDynamometry({...dynamometry, benchPressRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, benchPressRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.benchPressLeft} onChange={e => setDynamometry({...dynamometry, benchPressLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, benchPressLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Remada</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.rowRight} onChange={e => setDynamometry({...dynamometry, rowRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, rowRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.rowLeft} onChange={e => setDynamometry({...dynamometry, rowLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, rowLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Extensora</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legExtensionRight} onChange={e => setDynamometry({...dynamometry, legExtensionRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legExtensionRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legExtensionLeft} onChange={e => setDynamometry({...dynamometry, legExtensionLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legExtensionLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Flexora</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legCurlRight} onChange={e => setDynamometry({...dynamometry, legCurlRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legCurlRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legCurlLeft} onChange={e => setDynamometry({...dynamometry, legCurlLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legCurlLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Leg Press</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legPressRight} onChange={e => setDynamometry({...dynamometry, legPressRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legPressRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.legPressLeft} onChange={e => setDynamometry({...dynamometry, legPressLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, legPressLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest">Panturrilha</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Dir.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.calfRight} onChange={e => setDynamometry({...dynamometry, calfRight: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, calfRight: val})} /></div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Esq.</label>
                              <div className="relative flex items-center">
                                <input type="number" step="any" value={dynamometry.calfLeft} onChange={e => setDynamometry({...dynamometry, calfLeft: e.target.value})} className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10" placeholder="0" />
                                <div className="absolute right-1"><VoiceInputButton onResult={(val) => setDynamometry({...dynamometry, calfLeft: val})} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Relatório Resumido */}
                <div className={`space-y-8 ${viewMode === 'avaliador' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                  <div className="glass-card p-12 rounded-[56px] border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                      <div>
                        <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest md:tracking-[0.6em] mb-2 block">Score Global de Performance</span>
                        <div className="flex items-baseline gap-4">
                          <span className="text-[80px] md:text-[120px] font-black text-white italic tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(57,255,20,0.2)]">{dynamometryAnalysis.score}</span>
                          <span className="text-3xl font-black uppercase text-neon">{dynamometryAnalysis.classifyScore(dynamometryAnalysis.score)}</span>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-400 uppercase tracking-widest">Nível</span>
                          <span className="text-white">{dynamometryAnalysis.score}/100</span>
                        </div>
                        <div className="h-4 bg-dark/50 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className="h-full bg-gradient-to-r from-neon/50 to-neon rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${dynamometryAnalysis.score}%` }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6 relative overflow-hidden group hover:border-neon/30 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-neon/10 transition-colors pointer-events-none" />
                      <h3 className="text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3"><Activity size={16} className="text-neon"/> Hand Grip</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Força Máxima</span>
                          <span className="text-2xl font-black text-white">{dynamometryAnalysis.hgMax} <span className="text-sm text-gray-500">kgf</span></span>
                        </div>
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Classificação</span>
                          <span className="text-sm font-black text-neon bg-neon/10 px-3 py-1 rounded-lg">{dynamometryAnalysis.classifyHandGrip(dynamometryAnalysis.hgMax)}</span>
                        </div>
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Simetria Bilateral</span>
                          <div className="text-right">
                            <span className="text-sm font-black text-white block">{dynamometryAnalysis.classifyAsymmetry(dynamometryAnalysis.hgAsymmetry, dynamometryAnalysis.hgMax)}</span>
                            <span className="text-xs text-gray-500 font-bold">{dynamometryAnalysis.hgAsymmetry.toFixed(1)}% dif.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                      <h3 className="text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3"><Activity size={16} className="text-blue-400"/> Índices Globais</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">INM</span>
                          <span className="text-2xl font-black text-white">{dynamometryAnalysis.inm.toFixed(2)}</span>
                        </div>
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Classificação INM</span>
                          <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">{dynamometryAnalysis.classifyINM(dynamometryAnalysis.inm)}</span>
                        </div>
                        <div className="bg-dark/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Relação Sup/Inf</span>
                          <div className="text-right">
                            <span className="text-sm font-black text-white block">{dynamometryAnalysis.classifyRatio(dynamometryAnalysis.upperLowerRatio)}</span>
                            <span className="text-xs text-gray-500 font-bold">{dynamometryAnalysis.upperLowerRatio.toFixed(2)} ratio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
                    <h3 className="text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3"><Target size={16} className="text-neon"/> Força Relativa por Exercício (Total)</h3>
                    
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Bíceps', val: dynamometryAnalysis.relBiceps, type: 'upper' },
                            { name: 'Tríceps', val: dynamometryAnalysis.relTriceps, type: 'upper' },
                            { name: 'Supino', val: dynamometryAnalysis.relBenchPress, type: 'upper' },
                            { name: 'Remada', val: dynamometryAnalysis.relRow, type: 'upper' },
                            { name: 'Extensora', val: dynamometryAnalysis.relLegExtension, type: 'lower' },
                            { name: 'Flexora', val: dynamometryAnalysis.relLegCurl, type: 'lower' },
                            { name: 'Leg Press', val: dynamometryAnalysis.relLegPress, type: 'lower' },
                            { name: 'Panturrilha', val: dynamometryAnalysis.relCalf, type: 'lower' }
                          ]}
                          margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#39FF14' }}
                          />
                          <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                            {
                              [
                                { name: 'Bíceps', val: dynamometryAnalysis.relBiceps, type: 'upper' },
                                { name: 'Tríceps', val: dynamometryAnalysis.relTriceps, type: 'upper' },
                                { name: 'Supino', val: dynamometryAnalysis.relBenchPress, type: 'upper' },
                                { name: 'Remada', val: dynamometryAnalysis.relRow, type: 'upper' },
                                { name: 'Extensora', val: dynamometryAnalysis.relLegExtension, type: 'lower' },
                                { name: 'Flexora', val: dynamometryAnalysis.relLegCurl, type: 'lower' },
                                { name: 'Leg Press', val: dynamometryAnalysis.relLegPress, type: 'lower' },
                                { name: 'Panturrilha', val: dynamometryAnalysis.relCalf, type: 'lower' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.type === 'upper' ? '#39FF14' : '#3b82f6'} fillOpacity={0.8} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                      {[
                        { label: 'Bíceps', val: dynamometryAnalysis.relBiceps, type: 'upper' },
                        { label: 'Tríceps', val: dynamometryAnalysis.relTriceps, type: 'upper' },
                        { label: 'Supino', val: dynamometryAnalysis.relBenchPress, type: 'upper' },
                        { label: 'Remada', val: dynamometryAnalysis.relRow, type: 'upper' },
                        { label: 'Extensora', val: dynamometryAnalysis.relLegExtension, type: 'lower' },
                        { label: 'Flexora', val: dynamometryAnalysis.relLegCurl, type: 'lower' },
                        { label: 'Leg Press', val: dynamometryAnalysis.relLegPress, type: 'lower' },
                        { label: 'Panturrilha', val: dynamometryAnalysis.relCalf, type: 'lower' }
                      ].map((item, i) => (
                        <div key={i} className="bg-dark/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                          <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">{item.label}</span>
                          <div className="flex items-end justify-between">
                            <span className="text-xl font-black text-white">{item.val.toFixed(2)}<span className="text-xs text-gray-500 ml-1">x</span></span>
                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${item.type === 'upper' ? 'bg-neon/10 text-neon' : 'bg-blue-500/10 text-blue-400'}`}>
                              {dynamometryAnalysis.classifyStrength(item.val, item.type as any)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
                    <h3 className="text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3"><Activity size={16} className="text-neon"/> Simetria por Segmento (Dir. vs Esq.)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Bíceps', asym: dynamometryAnalysis.symmetries.biceps, max: Math.max(parseFloat(dynamometry.bicepsRight)||0, parseFloat(dynamometry.bicepsLeft)||0) },
                        { label: 'Tríceps', asym: dynamometryAnalysis.symmetries.triceps, max: Math.max(parseFloat(dynamometry.tricepsRight)||0, parseFloat(dynamometry.tricepsLeft)||0) },
                        { label: 'Supino', asym: dynamometryAnalysis.symmetries.benchPress, max: Math.max(parseFloat(dynamometry.benchPressRight)||0, parseFloat(dynamometry.benchPressLeft)||0) },
                        { label: 'Remada', asym: dynamometryAnalysis.symmetries.row, max: Math.max(parseFloat(dynamometry.rowRight)||0, parseFloat(dynamometry.rowLeft)||0) },
                        { label: 'Extensora', asym: dynamometryAnalysis.symmetries.legExtension, max: Math.max(parseFloat(dynamometry.legExtensionRight)||0, parseFloat(dynamometry.legExtensionLeft)||0) },
                        { label: 'Flexora', asym: dynamometryAnalysis.symmetries.legCurl, max: Math.max(parseFloat(dynamometry.legCurlRight)||0, parseFloat(dynamometry.legCurlLeft)||0) },
                        { label: 'Leg Press', asym: dynamometryAnalysis.symmetries.legPress, max: Math.max(parseFloat(dynamometry.legPressRight)||0, parseFloat(dynamometry.legPressLeft)||0) },
                        { label: 'Panturrilha', asym: dynamometryAnalysis.symmetries.calf, max: Math.max(parseFloat(dynamometry.calfRight)||0, parseFloat(dynamometry.calfLeft)||0) }
                      ].map((item, i) => {
                        const classification = dynamometryAnalysis.classifyAsymmetry(item.asym, item.max);
                        const isIdeal = classification === 'Simetria Ideal';
                        const isN_A = classification === 'N/A';
                        return (
                          <div key={i} className={`bg-dark/40 p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isN_A ? 'border-white/5' : isIdeal ? 'border-neon/30 shadow-[0_4px_20px_rgba(57,255,20,0.05)]' : 'border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.05)]'}`}>
                            <span className="text-[10px] font-black text-gray-500 uppercase block mb-2 tracking-widest">{item.label}</span>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-2xl font-black text-white">{isN_A ? '--' : `${item.asym.toFixed(1)}`}</span>
                              {!isN_A && <span className="text-sm font-bold text-gray-500">%</span>}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isN_A ? 'text-gray-600' : isIdeal ? 'text-neon' : 'text-red-400'}`}>{classification}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {dynamometryAnalysis.imbalances.length > 0 && (
                    <div className="glass-card p-10 rounded-[40px] border-red-500/30 bg-red-500/5 space-y-6">
                      <h3 className="text-red-400 text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3"><Activity size={16}/> Desequilíbrios Detectados</h3>
                      <ul className="space-y-3">
                        {dynamometryAnalysis.imbalances.map((imb, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-red-200/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            {imb}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {dynamometryAnalysisResult && (
                    <div className="glass-card p-12 rounded-[56px] border-neon/20 mt-8">
                      <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><BrainCircuit size={18}/> Laudo Profissional IA</h3>
                      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                        {dynamometryAnalysisResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Dinamometria" 
                studentName={formData.name} 
                data={{ dynamometry }} 
                onExportPdf={() => handleExportImage(dynamometryReportRef, 'Laudo-Dinamometria-360', 'pdf')} 
              />
            </div>
          )}

          {/* BIO-POSTURA */}
          {activeTab === 'posture' && (
            <div ref={postureReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden"><h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Bio-Postura <span className="text-neon">360</span></h1><p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Diagnóstico Biomecânico {trainerName}</p></div>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setShowPostureHelp(!showPostureHelp)} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                      <HelpCircle size={20} /> Como Fazer
                    </button>
                    <button onClick={() => handleExportImage(postureReportRef, 'Laudo-Biomecanico-Postura-360', 'pdf')} className="px-10 py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl"><Download size={20} /> Exportar Laudo Biomecânico (PDF)</button>
                  </div>
               </div>

               {showPostureHelp && (
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-4 animate-scale-in">
                   <h3 className="text-neon font-black uppercase tracking-widest text-sm">Instruções: Bio-Postura 360</h3>
                   <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                     <li><strong>Vestimenta:</strong> O aluno deve usar roupas de banho (sunga/biquíni) ou roupas justas (top e bermuda térmica) para permitir a visualização das articulações.</li>
                     <li><strong>Posicionamento:</strong> O aluno deve estar descalço, em posição natural e relaxada.</li>
                     <li><strong>Fundo:</strong> Utilize um fundo liso e com boa iluminação, preferencialmente com um simetrógrafo (quadriculado) atrás do aluno.</li>
                     <li><strong>Câmera:</strong> A câmera deve estar posicionada na altura da cicatriz umbilical do aluno, nivelada e a uma distância de cerca de 3 metros.</li>
                     <li><strong>Fotos:</strong> Tire as 4 fotos (Frontal, Posterior, Perfil Direito e Perfil Esquerdo) sem que o aluno saia do lugar, apenas girando.</li>
                   </ul>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 <PhotoAnalysis label="Frontal" photoUrl={uploadedPhotos.front} onUpload={b => handlePhotoUpload('front', b)} isScanning={loadingAnalysis} readOnly={viewMode === 'aluno'} />
                 <PhotoAnalysis label="Posterior" photoUrl={uploadedPhotos.back} onUpload={b => handlePhotoUpload('back', b)} isScanning={loadingAnalysis} readOnly={viewMode === 'aluno'} />
                 <PhotoAnalysis label="Perfil D" photoUrl={uploadedPhotos.right} onUpload={b => handlePhotoUpload('right', b)} isScanning={loadingAnalysis} readOnly={viewMode === 'aluno'} />
                 <PhotoAnalysis label="Perfil E" photoUrl={uploadedPhotos.left} onUpload={b => handlePhotoUpload('left', b)} isScanning={loadingAnalysis} readOnly={viewMode === 'aluno'} />
               </div>
               <div className="flex flex-col items-center mt-12 gap-12">
                  {viewMode === 'avaliador' && (
                  <button onClick={() => handleGenerateAIAnalysis('posture')} disabled={loadingAnalysis} className="px-16 py-8 bg-blue-600 text-white rounded-[40px] font-black uppercase tracking-[0.4em] shadow-xl flex items-center gap-6 hover:bg-blue-500 transition-all disabled:opacity-50">{loadingAnalysis ? <Loader2 className="animate-spin" size={24} /> : <BrainCircuit size={24} />} Processar Análise Inteligente</button>
                  )}
                  {posturalAnalysisResult && <div className="w-full glass-card p-16 rounded-[56px] border-neon/20 animate-in fade-in zoom-in duration-500"><div className="flex items-center gap-4 mb-8"><FileText className="text-neon" size={28} /><h3 className="text-2xl font-black uppercase tracking-widest text-white">Diagnóstico {trainerName}</h3></div><div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-lg">{posturalAnalysisResult}</div></div>}
               </div>
               <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Bio-Postura" 
                studentName={formData.name} 
                data={{ posturalAnalysisResult }} 
                onExportPdf={() => handleExportImage(postureReportRef, 'Laudo-Biomecanico-Postura-360', 'pdf')} 
              />
            </div>
          )}
          
          {/* TESTES CARDIORRESPIRATÓRIOS */}
          {activeTab === 'cardio' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Cardio <span className="text-neon">VO2</span></h1>
                    <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Testes de Resistência</p>
                  </div>
               </div>
               
               <CardioTests 
                 student={students.find(s => s.id === selectedStudentId)}
                 evaluation={formData}
                 onSave={(cardioData) => setFormData({ ...formData, cardioTest: cardioData })}
               />
               
               <div className="flex justify-end pt-8 border-t border-white/5">
                 {viewMode === 'avaliador' && (
                   <button onClick={handleSaveEvaluation} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon">
                     <Save size={20} /> Salvar Avaliação Completa
                   </button>
                 )}
               </div>
            </div>
          )}

          {/* TESTES DE FLEXIBILIDADE */}
          {activeTab === 'flexibility' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight">Flexibilidade <span className="text-neon">360</span></h1>
                    <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Testes de Amplitude Articular</p>
                  </div>
               </div>
               
               <FlexibilityTests 
                 student={students.find(s => s.id === selectedStudentId)}
                 evaluation={formData}
                 onSave={(flexibilityData) => setFormData({ ...formData, flexibilityTest: flexibilityData })}
               />
               
               <div className="flex justify-end pt-8 border-t border-white/5">
                 {viewMode === 'avaliador' && (
                   <button onClick={handleSaveEvaluation} className="px-10 py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-neon">
                     <Save size={20} /> Salvar Avaliação Completa
                   </button>
                 )}
               </div>
            </div>
          )}

          {/* RELATÓRIO GERAL */}
          {activeTab === 'relatorio' && (
            <div ref={relatorioReportRef} className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16">
                  <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Relatório <span className="text-neon">Geral</span></h1>
                    <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Síntese Completa da Avaliação</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {viewMode === 'avaliador' && (
                      <>
                        <button onClick={handleSaveEvaluation} className="px-6 md:px-8 py-4 md:py-5 bg-blue-500 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl w-full sm:w-auto justify-center"><Save size={16} /> Salvar Avaliação</button>
                        <button onClick={handleShareWhatsApp} className="px-6 md:px-8 py-4 md:py-5 bg-green-500 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-green-600 transition-all shadow-xl w-full sm:w-auto justify-center"><UserPlus size={16} /> WhatsApp</button>
                      </>
                    )}
                    <button onClick={() => handleExportImage(relatorioReportRef, 'Relatorio-Geral-360', 'png')} className="px-6 md:px-8 py-4 md:py-5 bg-white/5 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10 w-full sm:w-auto justify-center"><Download size={16} /> PNG</button>
                    <button onClick={() => window.print()} className="px-6 md:px-8 py-4 md:py-5 bg-neon text-dark font-black rounded-3xl uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-neon w-full sm:w-auto justify-center"><FileDown size={16} /> IMPRIMIR RELATÓRIO (A4)</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="glass-card p-12 rounded-[56px] border-white/5 space-y-8">
                     <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><User size={18}/> Dados do Aluno</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><span className="text-[10px] font-black text-gray-500 uppercase">Nome</span><p className="text-2xl font-black italic">{formData.name || '-'}</p></div>
                        <div><span className="text-[10px] font-black text-gray-500 uppercase">Objetivo</span><p className="text-2xl font-black italic">{formData.objective || '-'}</p></div>
                        <div><span className="text-[10px] font-black text-gray-500 uppercase">Peso Atual</span><p className="text-2xl font-black italic">{formData.weight || '-'} kg</p></div>
                        <div><span className="text-[10px] font-black text-gray-500 uppercase">Altura</span><p className="text-2xl font-black italic">{formData.height || '-'} cm</p></div>
                     </div>
                  </div>

                  <div className="glass-card p-12 rounded-[56px] border-white/5 space-y-8">
                     <h3 className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><Activity size={18}/> Destaques Fisiológicos</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase">Gordura Corporal</span>
                          <p className="text-3xl font-black italic text-red-500">{bio.bodyFat || '-'}%</p>
                          {bio.bodyFat && <ReferenceRuler value={parseFloat(bio.bodyFat)} min={getMinMax('bodyFat')[0]} max={getMinMax('bodyFat')[1]} idealRange={getIdealRange('bodyFat', formData.sex)} unit="%" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase">Massa Muscular</span>
                          <p className="text-3xl font-black italic text-neon">{bio.muscleRate || '-'}%</p>
                          {bio.muscleRate && <ReferenceRuler value={parseFloat(bio.muscleRate)} min={getMinMax('muscleRate')[0]} max={getMinMax('muscleRate')[1]} idealRange={getIdealRange('muscleRate', formData.sex)} unit="%" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase">Água Corporal</span>
                          <p className="text-3xl font-black italic text-cyan-500">{bio.bodyWater || '-'}%</p>
                          {bio.bodyWater && <ReferenceRuler value={parseFloat(bio.bodyWater)} min={getMinMax('bodyWater')[0]} max={getMinMax('bodyWater')[1]} idealRange={getIdealRange('bodyWater', formData.sex)} unit="%" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase">Idade Metabólica</span>
                          <p className="text-3xl font-black italic text-yellow-500">{bio.metabolicAge || '-'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {posturalAnalysisResult && (
                 <div className="glass-card p-12 rounded-[56px] border-neon/20">
                    <h3 className="text-neon text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><Scan size={18}/> Laudo Biomecânico</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                      {posturalAnalysisResult}
                    </div>
                 </div>
               )}

               {perimetryAnalysisResult && (
                 <div className="glass-card p-12 rounded-[56px] border-blue-500/20">
                    <h3 className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><Ruler size={18}/> Laudo Antropométrico</h3>
                    
                    <div className="mb-12">
                      <BodyHeatmap perimetry={perimetry} sex={formData.sex} />
                    </div>

                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                      {perimetryAnalysisResult}
                    </div>
                 </div>
               )}

               {formData.workoutPlan && (
                 <div className="glass-card p-12 rounded-[56px] border-red-500/20">
                    <h3 className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><Dumbbell size={18}/> Plano de Treino</h3>
                    
                    {formData.workoutPlan.workoutSplit ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Divisão</p>
                            <p className="text-2xl font-black text-white mt-1">{formData.workoutPlan.workoutSplit}</p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frequência</p>
                            <p className="text-2xl font-black text-white mt-1">{formData.workoutPlan.frequency}</p>
                          </div>
                          {formData.workoutPlan.periodization && (
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Periodização</p>
                              <p className="text-2xl font-black text-white mt-1">{formData.workoutPlan.periodization}</p>
                            </div>
                          )}
                          {formData.workoutPlan.renewalDate && (
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Troca de Ficha</p>
                              <p className="text-2xl font-black text-white mt-1">{formData.workoutPlan.renewalDate}</p>
                            </div>
                          )}
                        </div>

                        {formData.workoutPlan.caloricStrategy && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-dark/50 p-6 rounded-3xl border border-white/5 text-center print:bg-transparent print:border-gray-200">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Gasto Estimado</p>
                              <p className="text-3xl font-black text-white print:text-black">{formData.workoutPlan.caloricStrategy.estimatedBurn} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                            </div>
                            <div className="bg-dark/50 p-6 rounded-3xl border border-white/5 text-center print:bg-transparent print:border-gray-200">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Recomendação</p>
                              <p className="text-lg font-bold text-white mt-1 print:text-black">{formData.workoutPlan.caloricStrategy.recommendation}</p>
                            </div>
                          </div>
                        )}

                        {formData.workoutPlan.insights && (
                          <div className="bg-neon/5 p-8 rounded-3xl border border-neon/20">
                            <h4 className="text-sm font-black uppercase tracking-widest text-neon mb-6 flex items-center gap-2">
                              <Zap size={16} /> Insights e Estratégia
                            </h4>
                            
                            {formData.workoutPlan.insights.contraindicatedExercises?.length > 0 && (
                              <div className="mb-6">
                                <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Exercícios Contraindicados</h5>
                                <ul className="space-y-2">
                                  {formData.workoutPlan.insights.contraindicatedExercises.map((ex: any, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                      <span className="text-red-500 mt-1">•</span>
                                      <span><strong className="text-white">{ex.exercise}:</strong> {ex.reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {formData.workoutPlan.progressionStrategy && (
                              <div>
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Estratégia de Progressão</h5>
                                <p className="text-sm text-gray-300 leading-relaxed">{formData.workoutPlan.progressionStrategy}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-6">
                          {formData.workoutPlan.weeklySchedule?.map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className={`glass-card rounded-[32px] border ${day.isRestDay ? 'border-white/5 opacity-70' : 'border-neon/20'} overflow-hidden print:break-inside-avoid print:border-gray-300`}>
                              <div className={`p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${day.isRestDay ? 'bg-dark/50' : 'bg-neon/5'} print:bg-transparent`}>
                                <div>
                                  <h3 className="text-xl font-black uppercase tracking-widest text-white print:text-black">{day.dayOfWeek}</h3>
                                  <p className="text-sm font-bold text-neon mt-1 print:text-gray-600">{day.isRestDay ? 'Descanso' : day.workoutName}</p>
                                </div>
                                {day.isRestDay && (
                                  <div className="bg-dark/80 px-4 py-2 rounded-xl border border-white/5 max-w-md print:bg-transparent print:border-none print:p-0">
                                    <p className="text-xs text-gray-400 print:text-gray-600"><strong className="text-white print:text-black">Estratégia:</strong> {day.restReason}</p>
                                  </div>
                                )}
                              </div>

                              {day.curiosity && (
                                <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex items-start gap-3 print:bg-transparent print:border-gray-200">
                                  <Info size={16} className="text-neon shrink-0 mt-0.5 print:text-gray-500" />
                                  <p className="text-xs text-gray-300 print:text-gray-600"><strong className="text-white print:text-black">Curiosidade:</strong> {day.curiosity}</p>
                                </div>
                              )}
                              
                              {!day.isRestDay && day.exercises && (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse min-w-[800px] print:min-w-full">
                                    <thead>
                                      <tr className="border-b border-white/5 bg-black/20 print:bg-transparent print:border-gray-300">
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-gray-600">Exercício</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center print:text-gray-600">Séries x Reps</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center print:text-gray-600">Carga (kg)</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center print:text-gray-600">Cadência</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center print:text-gray-600">Descanso</th>
                                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-gray-600">Método/Obs</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 print:divide-gray-200">
                                      {day.exercises.map((ex: any, exIdx: number) => (
                                        <tr key={exIdx} className="hover:bg-white/5 transition-colors print:bg-transparent">
                                          <td className="p-4">
                                            <div className="text-sm font-bold text-white print:text-black">{ex.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 print:text-gray-500">{ex.equipment}</div>
                                          </td>
                                          <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                              <span className="w-8 text-sm font-black text-neon text-center print:text-black">{ex.sets}</span>
                                              <span className="text-xs text-gray-400 print:text-gray-500">x</span>
                                              <span className="w-12 text-sm font-bold text-white text-center print:text-black">{ex.reps}</span>
                                            </div>
                                          </td>
                                          <td className="p-4 text-center">
                                            <span className="inline-block w-20 bg-dark/50 border border-white/10 text-white rounded-lg px-2 py-1 text-center text-xs font-bold print:bg-transparent print:border-gray-300 print:text-black">{ex.load}</span>
                                          </td>
                                          <td className="p-4 text-center">
                                            <span className="w-16 text-xs text-gray-400 font-mono text-center print:text-gray-600">{ex.cadence}</span>
                                          </td>
                                          <td className="p-4 text-center">
                                            <span className="w-16 text-xs text-gray-400 text-center print:text-gray-600">{ex.rest}</span>
                                          </td>
                                          <td className="p-4">
                                            <div className="w-full text-xs text-neon font-bold print:text-black">{ex.method}</div>
                                            <div className="w-full text-[10px] opacity-70 mt-1 text-white print:text-gray-500">{ex.notes || '-'}</div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                        <Markdown>{formData.workoutPlan.plan || formData.workoutPlan.content || JSON.stringify(formData.workoutPlan)}</Markdown>
                      </div>
                    )}
                 </div>
               )}

               {formData.nutritionPlan && (
                 <div className="glass-card p-12 rounded-[56px] border-green-500/20">
                    <h3 className="text-green-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><Apple size={18}/> Plano Alimentar</h3>
                    
                    {formData.nutritionPlan.days ? (
                      <div className="space-y-8">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                          <h4 className="text-xl font-black text-white">{formData.nutritionPlan.title}</h4>
                          <p className="text-sm text-gray-400 mt-2">{formData.nutritionPlan.description}</p>
                          
                          {formData.nutritionPlan.macros && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                              <div className="bg-dark/50 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Calorias</p>
                                <p className="text-2xl font-black text-white mt-1">{formData.nutritionPlan.dailyCalories} <span className="text-xs font-normal text-gray-500">kcal</span></p>
                              </div>
                              <div className="bg-dark/50 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Proteínas</p>
                                <p className="text-2xl font-black text-white mt-1">{formData.nutritionPlan.macros.protein} <span className="text-xs font-normal text-gray-500">g</span></p>
                              </div>
                              <div className="bg-dark/50 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Carboidratos</p>
                                <p className="text-2xl font-black text-white mt-1">{formData.nutritionPlan.macros.carbs} <span className="text-xs font-normal text-gray-500">g</span></p>
                              </div>
                              <div className="bg-dark/50 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gorduras</p>
                                <p className="text-2xl font-black text-white mt-1">{formData.nutritionPlan.macros.fats} <span className="text-xs font-normal text-gray-500">g</span></p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          {formData.nutritionPlan.days.map((day: any, dayIdx: number) => (
                            <div key={dayIdx} className="glass-card rounded-[32px] border border-white/10 overflow-hidden print:break-inside-avoid print:border-gray-300">
                              <div className="bg-white/5 px-8 py-6 border-b border-white/10 print:bg-transparent">
                                <h4 className="text-xl font-black text-white print:text-black">{day.name}</h4>
                                {day.focus && <p className="text-xs text-green-400 font-bold uppercase tracking-widest mt-2 print:text-gray-600">{day.focus}</p>}
                              </div>
                              
                              <div className="p-8 space-y-8 print:bg-transparent">
                                {day.meals.map((meal: any, mealIdx: number) => (
                                  <div key={mealIdx} className="relative pl-8 border-l-2 border-white/10 print:border-gray-300">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-dark border-2 border-green-500 print:bg-white" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                      <h5 className="text-lg font-bold text-white print:text-black">{meal.name}</h5>
                                      <span className="text-xs font-black text-dark bg-green-500 px-3 py-1 rounded-xl w-fit print:bg-gray-200 print:text-gray-800">{meal.time}</span>
                                    </div>
                                    
                                    <ul className="space-y-2 mb-4">
                                      {meal.foods.map((food: string, fIdx: number) => (
                                        <li key={fIdx} className="text-sm text-gray-300 flex items-start gap-3 print:text-gray-700">
                                          <span className="text-green-500 mt-1">•</span>
                                          <span>{food}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    
                                    {meal.notes && (
                                      <p className="text-xs text-gray-400 italic bg-white/5 p-4 rounded-2xl print:bg-gray-50 print:text-gray-600">
                                        {meal.notes}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {formData.nutritionPlan.generalGuidelines && formData.nutritionPlan.generalGuidelines.length > 0 && (
                          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 print:break-inside-avoid print:bg-transparent print:border-gray-300">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6 print:text-black">Diretrizes Gerais</h4>
                            <ul className="space-y-3">
                              {formData.nutritionPlan.generalGuidelines.map((guide: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-3 print:text-gray-700">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span>{guide}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                        <Markdown>{formData.nutritionPlan.plan || formData.nutritionPlan.content || JSON.stringify(formData.nutritionPlan)}</Markdown>
                      </div>
                    )}
                 </div>
               )}

               <IntelligentReport 
                trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }}
                viewMode={viewMode}
                tabName="Relatório Geral" 
                studentName={formData.name} 
                data={{ formData, bio, perimetry, folds, dynamometry }} 
                onExportPdf={() => window.print()} 
              />
            </div>
          )}
          {activeTab === 'treino' && (
            <WorkoutGenerator 
              student={formData} 
              evaluation={{ bio, perimetry, folds, dynamometry, anamnesis: formData }} 
              trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }} 
              viewMode={viewMode}
              workoutHistory={formData.workoutPlans || []}
              onSelectPlan={(plan) => setFormData(prev => ({ ...prev, workoutPlan: plan }))}
              onSaveWorkout={(plan) => {
                if (!selectedStudentId) {
                  alert("Selecione um aluno primeiro.");
                  return;
                }
                
                const planId = plan.id || Date.now().toString();
                const newPlan = { ...plan, id: planId, date: plan.date || new Date().toISOString() };
                
                setStudents(prev => prev.map(s => {
                  if (s.id === selectedStudentId) {
                    const plans = s.workoutPlans || [];
                    const existingIdx = plans.findIndex(p => p.id === planId);
                    let newPlans;
                    if (existingIdx >= 0) {
                      newPlans = [...plans];
                      newPlans[existingIdx] = newPlan;
                    } else {
                      newPlans = [...plans, newPlan];
                    }
                    return { ...s, workoutPlans: newPlans };
                  }
                  return s;
                }));
                
                setFormData(prev => {
                  const plans = prev.workoutPlans || [];
                  const existingIdx = plans.findIndex(p => p.id === planId);
                  let newPlans;
                  if (existingIdx >= 0) {
                    newPlans = [...plans];
                    newPlans[existingIdx] = newPlan;
                  } else {
                    newPlans = [...plans, newPlan];
                  }
                  return { ...prev, workoutPlan: newPlan, workoutPlans: newPlans };
                });
                alert("Treino salvo com sucesso no histórico do aluno!");
              }}
              savedPlan={formData.workoutPlan}
            />
          )}
          {activeTab === 'nutricao' && (
            <NutritionGenerator 
              student={formData} 
              evaluation={{ bio, perimetry, folds, dynamometry, anamnesis: formData }} 
              trainerInfo={{ name: trainerName, cref: trainerCref, title: trainerTitle }} 
              viewMode={viewMode}
              nutritionHistory={formData.nutritionPlans || []}
              onSelectPlan={(plan) => setFormData(prev => ({ ...prev, nutritionPlan: plan }))}
              onSaveNutrition={(plan) => {
                if (!selectedStudentId) {
                  alert("Selecione um aluno primeiro.");
                  return;
                }
                
                const planId = plan.id || Date.now().toString();
                const newPlan = { ...plan, id: planId, date: plan.date || new Date().toISOString() };
                
                setStudents(prev => prev.map(s => {
                  if (s.id === selectedStudentId) {
                    const plans = s.nutritionPlans || [];
                    const existingIdx = plans.findIndex(p => p.id === planId);
                    let newPlans;
                    if (existingIdx >= 0) {
                      newPlans = [...plans];
                      newPlans[existingIdx] = newPlan;
                    } else {
                      newPlans = [...plans, newPlan];
                    }
                    return { ...s, nutritionPlans: newPlans };
                  }
                  return s;
                }));
                
                setFormData(prev => {
                  const plans = prev.nutritionPlans || [];
                  const existingIdx = plans.findIndex(p => p.id === planId);
                  let newPlans;
                  if (existingIdx >= 0) {
                    newPlans = [...plans];
                    newPlans[existingIdx] = newPlan;
                  } else {
                    newPlans = [...plans, newPlan];
                  }
                  return { ...prev, nutritionPlan: newPlan, nutritionPlans: newPlans };
                });
                alert("Plano alimentar salvo com sucesso no histórico do aluno!");
              }}
              savedPlan={formData.nutritionPlan}
            />
          )}
          {activeTab === 'monetizacao' && viewMode === 'avaliador' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8">
                <div className="w-full overflow-hidden">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display font-black italic uppercase leading-tight tracking-tighter">Monetização<br/><span className="text-neon">Assinaturas</span></h1>
                  <p className="text-gray-500 text-sm mt-4 font-bold tracking-widest md:tracking-[0.6em] uppercase">Gerencie pagamentos e acessos</p>
                </div>
              </div>

              {profile?.role === 'admin' ? (
                <div className="glass-card p-12 rounded-[56px] border-neon/20 space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center text-neon">
                      <Crown size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-widest text-white">Painel do Administrador</h2>
                      <p className="text-gray-400 mt-2">Gerencie planos, preços e acessos de Personais e Alunos.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-dark/50 p-8 rounded-3xl border border-white/5 space-y-6">
                      <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3"><Dumbbell size={20} className="text-neon"/> Plano Personal</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Valor Mensal (R$)</label>
                          <input type="number" defaultValue="50.00" className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none focus:border-neon transition-colors" />
                        </div>
                        <p className="text-xs text-gray-500">Bloqueia o acesso do Personal caso o pagamento não seja identificado.</p>
                      </div>
                    </div>

                    <div className="bg-dark/50 p-8 rounded-3xl border border-white/5 space-y-6">
                      <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3"><UserPlus size={20} className="text-blue-400"/> Plano Aluno</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Valor Trimestral (R$)</label>
                          <input type="number" defaultValue="300.00" className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none focus:border-blue-400 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-500">Libera o acesso aos dados de avaliação por 3 meses após o pagamento via Pix.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6">Gerenciamento Manual de Acessos</h3>
                    <div className="bg-dark/30 rounded-2xl border border-white/5 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Usuário</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5">
                            <td className="p-4 text-sm font-bold text-white">João Silva</td>
                            <td className="p-4 text-xs text-gray-400">Personal</td>
                            <td className="p-4"><span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase">Bloqueado</span></td>
                            <td className="p-4"><button className="text-xs font-bold text-neon hover:underline">Liberar Acesso</button></td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="p-4 text-sm font-bold text-white">Maria Souza</td>
                            <td className="p-4 text-xs text-gray-400">Aluno</td>
                            <td className="p-4"><span className="bg-neon/10 text-neon px-2 py-1 rounded-md text-[10px] font-bold uppercase">Ativo</span></td>
                            <td className="p-4"><button className="text-xs font-bold text-red-400 hover:underline">Bloquear</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 rounded-[56px] border-white/5 space-y-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center text-neon">
                      <Lock size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-widest text-white">Sua Assinatura</h2>
                      <p className="text-gray-400 mt-2">Gerencie seu acesso à plataforma.</p>
                    </div>
                  </div>

                  <div className="bg-dark/50 p-8 rounded-3xl border border-neon/30 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">Plano Personal</h3>
                        <p className="text-sm text-gray-400 mt-1">Acesso completo às ferramentas de avaliação e prescrição.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-white">R$ 50,00</span>
                        <span className="text-sm text-gray-500 block">/mês</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-neon animate-pulse" />
                        <span className="text-sm font-bold text-neon uppercase tracking-widest">Status: Ativo</span>
                      </div>
                      <span className="text-xs text-gray-500">Próximo vencimento: 15/04/2026</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-colors">
                    Gerenciar Pagamento
                  </button>
                </div>
              )}

              <div className="glass-card p-12 rounded-[56px] border-white/5 space-y-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-white">Integração Mercado Pago</h2>
                    <p className="text-gray-400 mt-2">Conecte sua conta para receber pagamentos via Pix automaticamente.</p>
                  </div>
                </div>
                
                <div className="bg-dark/50 p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white">Como funciona?</h3>
                  <ol className="list-decimal list-inside text-gray-400 space-y-4 font-medium">
                    <li>Você cria uma conta no <strong>Mercado Pago</strong>.</li>
                    <li>Acesse o painel de desenvolvedores e gere um <strong>Access Token de Produção</strong>.</li>
                    <li>Cole o seu Access Token no campo abaixo e salve.</li>
                    <li>O sistema irá gerar QR Codes Pix para os pagamentos dos alunos.</li>
                  </ol>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Access Token (Produção)</label>
                    <input 
                      type="password" 
                      className="w-full bg-white/5 border-b border-white/10 p-4 font-black text-xl outline-none focus:border-blue-400 transition-colors" 
                      value={mpToken} 
                      onChange={e => setMpToken(e.target.value)} 
                      placeholder="APP_USR-..." 
                    />
                  </div>
                  
                  <button 
                    onClick={handleSaveMpToken}
                    disabled={isSavingMpToken || !mpToken}
                    className="px-10 py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl w-full md:w-auto disabled:opacity-50"
                  >
                    {isSavingMpToken ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    Salvar Token
                  </button>
                  
                  {profile?.stripe_account_id && (
                    <div className="flex items-center gap-3 text-emerald-400 font-bold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mt-4">
                      <CheckCircle size={24} />
                      <span>Token do Mercado Pago configurado!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && profile?.role === 'admin' && (
            <AdminPanel />
          )}

          {activeTab === 'configuracoes' && (
            <Settings profile={profile} setProfile={setProfile} />
          )}
        </div>
      </main>

      <div className="fixed bottom-6 left-8 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] pointer-events-none">© 2025 SÉRGIO ARAUJO PERFORMANCE 360 • TODOS OS DIREITOS RESERVADOS</div>
      
      <Glossary />
    </div>
    <PrintableMasterReport 
      studentName={formData.name}
      studentObjective={formData.objective}
      studentWeight={formData.weight}
      studentHeight={formData.height}
      studentAge={formData.age}
      studentSex={formData.sex}
      studentPhotoUrl={formData.photoUrl}
      trainerName={trainerName}
      trainerCref={trainerCref}
      trainerLogo={trainerLogo}
      bio={bio}
      folds={folds}
      perimetry={perimetry}
      dynamometry={dynamometry}
      cardioTest={formData.cardioTest}
      flexibilityTest={formData.flexibilityTest}
      anamnese={formData.anamnesisData}
      posturalAnalysisResult={posturalAnalysisResult}
      perimetryAnalysisResult={perimetryAnalysisResult}
      dynamometryAnalysisResult={dynamometryAnalysisResult}
      workoutPlan={formData.workoutPlan}
      nutritionPlan={formData.nutritionPlan}
    />
    </>
  );
};

export default App;

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  Menu,
  X,
  Send,
  Building2,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Tipos y Constantes ---

type Priority = 'Alta' | 'Media' | 'Baja' | 'Revisión';
type CompanySize = 'pequeña' | 'mediana' | 'grande';
type UserType = 'empresa' | 'estudiante' | 'otro';

interface Lead {
  id: string;
  company_name: string;
  company_size: CompanySize;
  urgency: boolean;
  budget_available: boolean;
  budget: number;
  genuine_interest: boolean;
  data_completeness: number; // 0-100
  user_type: UserType;
  free_trial: boolean;
  data_inconsistencias: boolean;
  sensitive_case: boolean;
  priority: Priority;
  createdAt: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    company_name: 'Tech Giant Corp',
    company_size: 'grande',
    urgency: true,
    budget_available: true,
    budget: 50000,
    genuine_interest: true,
    data_completeness: 100,
    user_type: 'empresa',
    free_trial: false,
    data_inconsistencias: false,
    sensitive_case: false,
    priority: 'Alta',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    company_name: 'Midway Solutions',
    company_size: 'mediana',
    urgency: false,
    budget_available: true,
    budget: 15000,
    genuine_interest: true,
    data_completeness: 85,
    user_type: 'empresa',
    free_trial: false,
    data_inconsistencias: false,
    sensitive_case: false,
    priority: 'Media',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    company_name: 'EduLearn Academy',
    company_size: 'pequeña',
    urgency: false,
    budget_available: false,
    budget: 0,
    genuine_interest: true,
    data_completeness: 90,
    user_type: 'estudiante',
    free_trial: true,
    data_inconsistencias: false,
    sensitive_case: false,
    priority: 'Baja',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    company_name: 'Ambiguous Ventures',
    company_size: 'mediana',
    urgency: true,
    budget_available: true,
    budget: 20000,
    genuine_interest: true,
    data_completeness: 40,
    user_type: 'empresa',
    free_trial: false,
    data_inconsistencias: true,
    sensitive_case: false,
    priority: 'Revisión',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    company_name: 'Logística Global',
    company_size: 'grande',
    urgency: true,
    budget_available: true,
    budget: 100000,
    genuine_interest: true,
    data_completeness: 95,
    user_type: 'empresa',
    free_trial: false,
    data_inconsistencias: false,
    sensitive_case: false,
    priority: 'Alta',
    createdAt: new Date().toISOString()
  }
];

// --- Utilidades ---

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'Alta': return 'bg-red-50 text-red-700 border-red-200';
    case 'Media': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Baja': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Revisión': return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getBadgeDotColor = (priority: Priority) => {
  switch (priority) {
    case 'Alta': return 'bg-red-500';
    case 'Media': return 'bg-amber-500';
    case 'Baja': return 'bg-emerald-500';
    case 'Revisión': return 'bg-slate-400';
  }
};

const classifyLead = (lead: Omit<Lead, 'id' | 'priority' | 'createdAt'>): Priority => {
  // Prioridad de sobreescritura lógica: Revisión > Alta > Media > Baja
  
  // 4. REVISIÓN HUMANA
  if (lead.data_inconsistencias || lead.data_completeness < 50 || lead.sensitive_case) {
    return 'Revisión';
  }

  // 1. PRIORIDAD ALTA
  if (lead.company_size === 'grande' && lead.urgency && lead.budget_available) {
    return 'Alta';
  }

  // 2. PRIORIDAD MEDIA
  if (lead.company_size === 'mediana' && lead.genuine_interest && lead.data_completeness >= 70) {
    return 'Media';
  }

  // 3. PRIORIDAD BAJA
  if (lead.user_type === 'estudiante' || lead.free_trial || lead.budget === 0) {
    return 'Baja';
  }

  // Fallback por defecto
  return 'Revisión';
};

// --- Componentes ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'router', label: 'Lógica del Router', icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
        <span className="text-xl font-bold text-white tracking-tight">Leadrify</span>
      </div>
      
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Plan Gratuito</p>
          <div className="flex justify-between items-center text-sm font-medium text-white mb-2">
            <span>Leads rastreados</span>
            <span>42/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[42%]"></div>
          </div>
          <button className="w-full mt-4 py-2 px-4 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
            Mejorar Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900 capitalize">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar leads..." 
            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        
        <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Iker Muñoz</p>
            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-tight font-medium">Desarrollador B2B</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            <User size={20} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} className="opacity-90" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const LeadFormModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (lead: any) => void }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_size: 'pequeña' as CompanySize,
    urgency: false,
    budget_available: false,
    budget: 0,
    genuine_interest: true,
    data_completeness: 100,
    user_type: 'empresa' as UserType,
    free_trial: false,
    data_inconsistencias: false,
    sensitive_case: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'budget' || name === 'data_completeness' ? Number(value) : value)
    }));
  };

  const currentPriority = useMemo(() => classifyLead(formData), [formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Nueva Entrada de Lead</h3>
            <p className="text-slate-500 text-sm mt-1">Rellena los detalles para enrutar el lead automáticamente.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Empresa</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="ej. Acme Corp" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tamaño de la Empresa</label>
                <select 
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="pequeña">Pequeña (1-50)</option>
                  <option value="mediana">Mediana (51-500)</option>
                  <option value="grande">Grande (500+)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presupuesto Estimado ($)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number" 
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Usuario</label>
                <select 
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="empresa">Empresa / Negocio</option>
                  <option value="estudiante">Estudiante</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completitud de Datos ({formData.data_completeness}%)</label>
              </div>
              <input 
                type="range" 
                name="data_completeness"
                value={formData.data_completeness}
                onChange={handleChange}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'urgency', label: 'Necesidad Urgente' },
                { id: 'budget_available', label: 'Presupuesto Confirmado' },
                { id: 'genuine_interest', label: 'Interés Genuino' },
                { id: 'free_trial', label: 'Prueba Solicitada' },
                { id: 'data_inconsistencias', label: 'Inconsistencias en Datos' },
                { id: 'sensitive_case', label: 'Caso Sensible' },
              ].map((field) => (
                <label key={field.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    name={field.id}
                    checked={(formData as any)[field.id]}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                  />
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                </label>
              ))}
            </div>
          </form>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ruta Estimada:</span>
            <div className={`px-4 py-1.5 rounded-full border text-sm font-black flex items-center gap-2 ${getPriorityColor(currentPriority)}`}>
              <div className={`w-2 h-2 rounded-full ${getBadgeDotColor(currentPriority)} animate-pulse`} />
              {currentPriority}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onSubmit(formData)}
              className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Send size={18} />
              Enrutar Lead
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardView = ({ leads, stats }: { leads: Lead[], stats: any }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Leads Totales" 
          value={stats.total} 
          icon={Users} 
          trend={12} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          label="Prioridad Alta" 
          value={stats.Alta} 
          icon={Zap} 
          trend={8} 
          color="bg-red-100 text-red-600" 
        />
        <StatCard 
          label="Prioridad Media" 
          value={stats.Media} 
          icon={TrendingUp} 
          trend={-3} 
          color="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          label="Requiere Revisión" 
          value={stats.Revisión} 
          icon={AlertCircle} 
          color="bg-slate-100 text-slate-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              Leads Cualificados Recientes
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Prioridad</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Creado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-white transition-colors">
                          {lead.company_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{lead.company_name}</p>
                          <p className="text-[11px] text-slate-500 capitalize">Empresa {lead.company_size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-full border text-[11px] font-black flex w-fit items-center gap-1.5 ${getPriorityColor(lead.priority)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getBadgeDotColor(lead.priority)}`} />
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Insights Inteligentes</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Basado en tu lógica actual, los leads de <span className="font-bold text-white">Prioridad Alta</span> están convirtiendo al 42%. Considera relajar el filtro de urgencia para capturar más ingresos.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Punt. Crecimiento</span>
                  <span className="text-sm font-black">+14%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[75%]"></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Eficiencia</span>
                  <span className="text-sm font-black">92/100</span>
                </div>
                <div className="w-full h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          <button className="relative z-10 w-full mt-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all">
            Generar Informe
          </button>
        </div>
      </div>
    </div>
  );
};

const RouterLogicView = () => {
  const routes = [
    { 
      title: 'Alta (Cierre Inmediato)', 
      priority: 'Alta', 
      icon: Zap,
      desc: 'Leads de alto valor que requieren intervención de ventas inmediata.',
      conditions: ['Tamaño: Grande', 'Urgente: Sí', 'Presupuesto: Disponible'],
      action: 'Notificación Slack inmediata + Asignación ventas senior.'
    },
    { 
      title: 'Media (CRM & Nurturing)', 
      priority: 'Media', 
      icon: TrendingUp,
      desc: 'Potencial moderado. Requiere cualificación y nutrición.',
      conditions: ['Tamaño: Mediana', 'Interés genuino: Sí', 'Completitud: ≥ 70%'],
      action: 'Entrada en Pipeline CRM + Campaña de Email Marketing.'
    },
    { 
      title: 'Baja (Educación)', 
      priority: 'Baja', 
      icon: CheckCircle2,
      desc: 'Leads en etapa temprana o auto-servicio. Requieren educación.',
      conditions: ['Tipo: Estudiante', 'Prueba gratuita: Sí', 'Presupuesto: $0'],
      action: 'Campañas de nutrición (Nurturing) de auto-servicio.'
    },
    { 
      title: 'Revisión Humana', 
      priority: 'Revisión', 
      icon: AlertCircle,
      desc: 'Datos anómalos o incompletos que requieren investigación manual.',
      conditions: ['Inconsistencias: Sí', 'Completitud: < 50%', 'Caso Sensible: Sí'],
      action: 'Marcar como pendiente + Ticket para SDR Junior.'
    }
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Configuración del Router</h3>
          <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Optimización de Lógica y Flujo</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          Editar Flujo Global
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {routes.map((route, i) => (
          <motion.div 
            key={route.priority}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative group overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-500 group-hover:scale-125 transform translate-x-12 -translate-y-12`}>
              <route.icon size={128} />
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-3xl ${getPriorityColor(route.priority as any)}`}>
                <route.icon size={28} />
              </div>
              <div className={`px-4 py-1.5 rounded-full border text-[11px] font-black flex items-center gap-1.5 ${getPriorityColor(route.priority as any)}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getBadgeDotColor(route.priority as any)}`} />
                {route.priority}
              </div>
            </div>

            <h4 className="text-xl font-black text-slate-900 mb-2">{route.title}</h4>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">{route.desc}</p>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Condiciones Establecidas</p>
                <div className="flex flex-wrap gap-2">
                  {route.conditions.map(cond => (
                    <span key={cond} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-600">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Acción Principal</p>
                <div className="p-3 bg-blue-50/50 rounded-2xl flex items-center gap-2">
                  <Send size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">{route.action}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-100 rounded-2xl text-xs font-bold text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
              Configurar Nodo
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Aplicación Principal ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Cargar de localStorage
  useEffect(() => {
    const saved = localStorage.getItem('leadrify_leads');
    if (saved) {
      setLeads(JSON.parse(saved));
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem('leadrify_leads', JSON.stringify(INITIAL_LEADS));
    }
  }, []);

  const stats = useMemo(() => ({
    total: leads.length,
    Alta: leads.filter(l => l.priority === 'Alta').length,
    Media: leads.filter(l => l.priority === 'Media').length,
    Baja: leads.filter(l => l.priority === 'Baja').length,
    Revisión: leads.filter(l => l.priority === 'Revisión').length,
  }), [leads]);

  const handleAddLead = (formData: any) => {
    const priority = classifyLead(formData);
    const newLead: Lead = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      priority,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('leadrify_leads', JSON.stringify(updated));
    setIsFormOpen(false);
    
    setNotification(`Cualificado correctamente ${newLead.company_name} en "${priority}"`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 flex flex-col min-h-screen">
        <Header title={activeTab === 'dashboard' ? 'Resumen' : activeTab === 'leads' ? 'Directorio de Leads' : 'Configuración de Lógica'} />
        
        <div className="flex-1 p-8 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' && 'Cuadro de Mando'}
                  {activeTab === 'leads' && 'Gestión de Pipeline'}
                  {activeTab === 'router' && 'Lógica de Clasificación'}
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                  Gestiona la automatización de tu negocio desde un centro unificado.
                </p>
              </motion.div>
            </AnimatePresence>

            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all w-full sm:w-auto"
            >
              <Plus size={20} strokeWidth={3} />
              Añadir Nuevo Lead
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DashboardView leads={leads} stats={stats} />
              </motion.div>
            )}
            
            {activeTab === 'leads' && (
              <motion.div 
                key="leads" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-auto">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Filtrar por nombre..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full sm:w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-white transition-all">
                      <Filter size={14} />
                      Todas las Prioridades
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/10">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Entidad Empresarial</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Perfil de Mercado</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Nodo de Estado</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Fecha Entrada</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Puntuación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                                {lead.company_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 leading-tight">{lead.company_name}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #{lead.id.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-slate-600 flex items-center gap-2">
                                <Building2 size={12} className="text-slate-300" />
                                Tamaño {lead.company_size.charAt(0).toUpperCase() + lead.company_size.slice(1)}
                              </span>
                              <span className="text-xs font-black text-slate-600 flex items-center gap-2">
                                <DollarSign size={12} className="text-slate-300" />
                                {lead.budget > 0 ? `$${lead.budget.toLocaleString()}` : 'No especificado'}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-5 py-2 rounded-2xl border text-[10px] font-black flex w-fit items-center gap-2 ${getPriorityColor(lead.priority)}`}>
                              <div className={`w-2 h-2 rounded-full ${getBadgeDotColor(lead.priority)}`} />
                              {lead.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-bold text-slate-600">{new Date(lead.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(lead.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${lead.data_completeness > 70 ? 'bg-emerald-500' : lead.data_completeness > 40 ? 'bg-amber-500' : 'bg-red-500'} transition-all`} style={{ width: `${lead.data_completeness}%` }}></div>
                              </div>
                              <span className="text-xs font-black text-slate-800">{lead.data_completeness}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'router' && (
              <motion.div
                key="router"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RouterLogicView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-auto py-6 px-12 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white">
          <p>© 2026 Leadrify Systems. Todos los derechos reservados.</p>
          <div className="flex items-center gap-8 mt-4 sm:mt-0">
            <a href="#" className="hover:text-blue-600 cursor-pointer">Protocolo de Privacidad</a>
            <a href="#" className="hover:text-blue-600 cursor-pointer">Registro de Seguridad</a>
            <a href="#" className="hover:text-blue-600 cursor-pointer">Documentación API</a>
          </div>
        </footer>
      </main>

      <LeadFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddLead} 
      />

      {/* Toast de Notificaciones */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black">Lead Enrutado con Éxito</p>
              <p className="text-xs text-slate-400 font-medium">{notification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

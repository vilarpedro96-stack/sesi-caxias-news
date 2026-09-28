import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { AdminUser } from '../types';
import { apiService } from '../services/api';
import { SesiLogo } from './SesiLogo';

interface AdminLoginProps {
  admins: AdminUser[];
  onLoginSuccess: (admin: AdminUser) => void;
  onUpdateAdminPassword: (adminId: number, newPassword: string) => Promise<void>;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onUpdateAdminPassword,
  onBack
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [step, setStep] = useState<'login' | 'first_access'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Main login handler with Email and Password
  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error('Por favor, informe seu e-mail institucional.');
      return;
    }

    if (!password) {
      toast.error('Por favor, digite sua senha de acesso.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiService.login(cleanEmail, password).catch((err) => {
        return { error: err.message || 'Falha ao autenticar' };
      });

      if (res && 'isPending' in res && res.isPending && res.admin) {
        setCurrentAdmin(res.admin);
        setPassword('');
        setConfirmPassword('');
        setStep('first_access');
        toast.info('Primeiro acesso: cadastre sua senha. Na proxima vez, use essa mesma senha.');
        return;
      }

      if (res && 'admin' in res && res.admin && !('error' in res)) {
        toast.success('Login realizado com sucesso!');
        onLoginSuccess(res.admin);
        return;
      }

      if (res && 'error' in res && res.error) {
        toast.error(String(res.error));
        return;
      }

      toast.error('E-mail ou senha incorretos. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for setting up first access password
  const handleFirstAccessPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;

    if (password.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateAdminPassword(currentAdmin.id, password);
      toast.success('Senha salva. Use este e-mail e esta senha nos proximos acessos.');
      onLoginSuccess({ ...currentAdmin, password, isPending: false });
    } catch {
      toast.error('Nao foi possivel salvar a senha no banco. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-login-view"
      className="min-h-screen bg-gray-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 py-12 transition-colors duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 p-8 transition-colors">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SesiLogo className="h-20 w-20" size={80} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Área Administrativa
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Painel de gestão de conteúdos e publicações do SESI CAXIAS NEWS
          </p>
        </div>

        {/* Form: Email & Password Juntos */}
        {step === 'login' && (
          <form onSubmit={handleDirectLogin} className="space-y-4">
            {/* Campo E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                E-mail Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
                  <User size={18} />
                </div>
                <input
                  id="admin-login-email-input"
                  type="email"
                  placeholder="ex: admin@sesi.org.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
                  <Lock size={18} />
                </div>
                <input
                  id="admin-login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800 dark:text-white text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 mt-2"
            >
              <LogIn size={18} />
              {isLoading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>
        )}

        {/* Step: Definir Senha no Primeiro Acesso */}
        {step === 'first_access' && (
          <form onSubmit={handleFirstAccessPassword} className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-3 rounded-lg text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
                Primeiro Acesso Detectado
              </p>
              Olá <strong className="text-blue-950 dark:text-white">{email}</strong>! Por segurança, crie sua senha pessoal de acesso.
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
                  <KeyRound size={18} />
                </div>
                <input
                  id="admin-first-access-new-password"
                  type="password"
                  placeholder="Mínimo 4 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800 dark:text-white text-sm"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-neutral-500">
                  <KeyRound size={18} />
                </div>
                <input
                  id="admin-first-access-confirm-password"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-800 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            <button
              id="admin-first-access-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <KeyRound size={18} />
              {isLoading ? 'Salvando...' : 'Cadastrar Senha e Entrar'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('login');
                setPassword('');
                setConfirmPassword('');
              }}
              className="w-full text-center text-xs text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 mt-2 cursor-pointer"
            >
              Voltar ao login normal
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="mt-6 pt-4 text-center border-t border-gray-100 dark:border-neutral-800">
          <button
            id="admin-back-to-site-btn"
            onClick={onBack}
            className="text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
};

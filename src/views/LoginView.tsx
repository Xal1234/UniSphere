import React, { useState } from 'react';
import {
  Lock,
  User,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building,
  KeyRound,
  Info,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole, accountId: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFillDemo = (id: string, pass: string) => {
    setLoginId(id);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = loginId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError('Please enter both Login ID and Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (trimmedId.toUpperCase() === 'STU001' && trimmedPass === 'Student@123') {
        onLogin('student', 'STU001');
      } else if (trimmedId.toUpperCase() === 'ADM001' && trimmedPass === 'Admin@123') {
        onLogin('admin', 'ADM001');
      } else {
        setLoading(false);
        setError('Invalid credentials. Use demo accounts STU001 (Student@123) or ADM001 (Admin@123).');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top University Branding Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold text-lg shadow-inner">
            C1
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CampusOne <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">UniSphere</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Biju Patnaik University of Technology · Central Academic ERP
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Building className="w-4 h-4 text-slate-500" />
          <span>Rourkela Main Campus, Odisha</span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Single Sign-On Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your university credentials to access student services or faculty administration.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Login ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. STU001 or ADM001"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-teal-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-400" />
              <span>Available Demo Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Student demo card */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    <span>Student Portal</span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-300 space-y-0.5">
                    <div>ID: <strong className="text-teal-300">STU001</strong></div>
                    <div>Pass: <span className="text-slate-400">Student@123</span></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemo('STU001', 'Student@123')}
                  className="mt-2.5 py-1 px-2 text-[10px] font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/50 rounded transition-colors text-center w-full"
                >
                  Use Student Demo
                </button>
              </div>

              {/* Admin demo card */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Faculty / Admin</span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-300 space-y-0.5">
                    <div>ID: <strong className="text-amber-300">ADM001</strong></div>
                    <div>Pass: <span className="text-slate-400">Admin@123</span></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemo('ADM001', 'Admin@123')}
                  className="mt-2.5 py-1 px-2 text-[10px] font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 rounded transition-colors text-center w-full"
                >
                  Use Admin Demo
                </button>
              </div>
            </div>

            {/* Prototype notice disclaimer */}
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              * Demonstration prototype: Roles and permissions are strictly enforced upon sign-in. Changing accounts requires logging out and signing in with the corresponding role account.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
        © 2026 Biju Patnaik University of Technology (BPUT) · Student & Faculty Centralized Academic Portal
      </div>
    </div>
  );
};

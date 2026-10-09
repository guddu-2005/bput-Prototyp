import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileText,
  BarChart3,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import type { PortalRole } from '../../types/auth';
import { useDemoAuth, ALL_DEMO_PORTAL_CREDENTIALS } from '../../context/DemoAuthContext';

interface RoleLoginFormProps {
  roleId: PortalRole;
  roleTitle: string;
  onForgotPassword: () => void;
  onSubmitSuccess: (message: string) => void;
}

export const RoleLoginForm: React.FC<RoleLoginFormProps> = ({
  roleId,
  roleTitle,
  onForgotPassword,
  onSubmitSuccess,
}) => {
  const {
    isDemoAdminEnabled,
    isDemoReviewerEnabled,
    isDemoContributorEnabled,
    isDemoManagementEnabled,
    isDemoAuditorEnabled,
    loginDemoAdmin,
    loginDemoReviewer,
    loginDemoContributor,
    loginDemoManagement,
    loginDemoAuditor,
    fillDemoAdminCredentials,
    fillDemoReviewerCredentials,
    fillDemoContributorCredentials,
    fillDemoManagementCredentials,
    fillDemoAuditorCredentials,
  } = useDemoAuth();

  const navigate = useNavigate();

  const storageKey = `meil_saved_email_${roleId}`;

  const [email, setEmail] = useState(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => {
    return Boolean(localStorage.getItem(storageKey));
  });

  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const demoCreds = ALL_DEMO_PORTAL_CREDENTIALS[roleId] || ALL_DEMO_PORTAL_CREDENTIALS['esg-admin'];

  // Role identity checks
  const isEsgAdmin = roleId === 'esg-admin';
  const isReviewer = roleId === 'reviewer-approver';
  const isContributor = roleId === 'data-contributor';
  const isManagement = roleId === 'management';
  const isAuditor = roleId === 'auditor-assurer';

  const isDemoEnabledForThisRole =
    (isEsgAdmin && isDemoAdminEnabled) ||
    (isReviewer && isDemoReviewerEnabled) ||
    (isContributor && isDemoContributorEnabled) ||
    (isManagement && isDemoManagementEnabled) ||
    (isAuditor && isDemoAuditorEnabled);

  // Auto-fill credentials handler
  const handleAutoFill = () => {
    let creds: { email: string; password: string } | null = null;
    if (isEsgAdmin) creds = fillDemoAdminCredentials();
    else if (isReviewer) creds = fillDemoReviewerCredentials();
    else if (isContributor) creds = fillDemoContributorCredentials();
    else if (isManagement) creds = fillDemoManagementCredentials();
    else if (isAuditor) creds = fillDemoAuditorCredentials();

    const targetEmail = creds?.email || demoCreds.email;
    const targetPassword = creds?.password || demoCreds.password;

    setEmail(targetEmail);
    setPassword(targetPassword);
    setErrors({});
  };

  // 1-Click Quick Demo Sign In
  const handleQuickSignIn = async () => {
    const targetEmail = demoCreds.email;
    const targetPassword = demoCreds.password;
    setEmail(targetEmail);
    setPassword(targetPassword);
    setErrors({});
    setIsLoading(true);

    try {
      if (isEsgAdmin) {
        const res = await loginDemoAdmin(targetEmail, targetPassword);
        setIsLoading(false);
        if (res.success) {
          onSubmitSuccess('ESG Admin demo session initialized.');
          navigate('/admin/dashboard');
        } else {
          setErrors({ general: res.error || 'Authentication failed.' });
        }
      } else if (isReviewer) {
        const res = await loginDemoReviewer(targetEmail, targetPassword);
        setIsLoading(false);
        if (res.success) {
          onSubmitSuccess('Reviewer demo session initialized.');
          navigate('/reviewer/dashboard');
        } else {
          setErrors({ general: res.error || 'Authentication failed.' });
        }
      } else if (isContributor) {
        const res = await loginDemoContributor(targetEmail, targetPassword);
        setIsLoading(false);
        if (res.success) {
          onSubmitSuccess('Data Contributor demo session initialized.');
          navigate('/contributor/dashboard');
        } else {
          setErrors({ general: res.error || 'Authentication failed.' });
        }
      } else if (isManagement) {
        const res = await loginDemoManagement(targetEmail, targetPassword);
        setIsLoading(false);
        if (res.success) {
          onSubmitSuccess('Executive Management demo session initialized.');
          navigate('/management/dashboard');
        } else {
          setErrors({ general: res.error || 'Authentication failed.' });
        }
      } else if (isAuditor) {
        const res = await loginDemoAuditor(targetEmail, targetPassword);
        setIsLoading(false);
        if (res.success) {
          onSubmitSuccess('Auditor / Assurer demo session initialized.');
          navigate('/auditor/dashboard');
        } else {
          setErrors({ general: res.error || 'Authentication failed.' });
        }
      }
    } catch {
      setIsLoading(false);
      setErrors({ general: 'Failed to process demo authentication.' });
    }
  };

  const handleCopy = (field: 'email' | 'password', val: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid work email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (rememberEmail) {
      localStorage.setItem(storageKey, email.trim());
    } else {
      localStorage.removeItem(storageKey);
    }

    // ESG Admin Demo Login
    if (isEsgAdmin && isDemoAdminEnabled) {
      const result = await loginDemoAdmin(email, password);
      setIsLoading(false);
      if (result.success) {
        onSubmitSuccess('ESG Admin demo session initialized.');
        navigate('/admin/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid ESG Admin credentials.',
        }));
      }
      return;
    }

    // Reviewer / Approver Demo Login
    if (isReviewer && isDemoReviewerEnabled) {
      const result = await loginDemoReviewer(email, password);
      setIsLoading(false);
      if (result.success) {
        onSubmitSuccess('Reviewer demo session initialized.');
        navigate('/reviewer/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Reviewer credentials.',
        }));
      }
      return;
    }

    // Data Contributor Demo Login
    if (isContributor && isDemoContributorEnabled) {
      const result = await loginDemoContributor(email, password);
      setIsLoading(false);
      if (result.success) {
        onSubmitSuccess('Data Contributor demo session initialized.');
        navigate('/contributor/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Data Contributor credentials.',
        }));
      }
      return;
    }

    // Executive Management Demo Login
    if (isManagement && isDemoManagementEnabled) {
      const result = await loginDemoManagement(email, password);
      setIsLoading(false);
      if (result.success) {
        onSubmitSuccess('Executive Management demo session initialized.');
        navigate('/management/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Management credentials.',
        }));
      }
      return;
    }

    // Auditor / Assurer Demo Login
    if (isAuditor && isDemoAuditorEnabled) {
      const result = await loginDemoAuditor(email, password);
      setIsLoading(false);
      if (result.success) {
        onSubmitSuccess('Auditor / Assurer demo session initialized.');
        navigate('/auditor/dashboard');
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || 'Invalid Auditor credentials.',
        }));
      }
      return;
    }

    // Fallback if demo is disabled
    setTimeout(() => {
      setIsLoading(false);
      onSubmitSuccess('Authentication service will be connected in subsequent phases.');
    }, 1000);
  };

  // Role visual accents
  const roleThemes = {
    'esg-admin': {
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600',
      text: 'text-emerald-950',
      subText: 'text-emerald-700',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
      icon: ShieldCheck,
    },
    'data-contributor': {
      bg: 'bg-teal-50/90',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-600',
      text: 'text-teal-950',
      subText: 'text-teal-700',
      btnBg: 'bg-teal-700 hover:bg-teal-800',
      icon: FileText,
    },
    'reviewer-approver': {
      bg: 'bg-sky-50/90',
      border: 'border-sky-200',
      badgeBg: 'bg-[#003B73]',
      text: 'text-sky-950',
      subText: 'text-sky-700',
      btnBg: 'bg-[#003B73] hover:bg-[#002B54]',
      icon: UserCheck,
    },
    'management': {
      bg: 'bg-indigo-50/90',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600',
      text: 'text-indigo-950',
      subText: 'text-indigo-700',
      btnBg: 'bg-indigo-700 hover:bg-indigo-800',
      icon: BarChart3,
    },
    'auditor-assurer': {
      bg: 'bg-purple-50/90',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600',
      text: 'text-purple-950',
      subText: 'text-purple-700',
      btnBg: 'bg-purple-700 hover:bg-purple-800',
      icon: ShieldCheck,
    },
  };

  const currentTheme = roleThemes[roleId] || roleThemes['esg-admin'];
  const ThemeIcon = currentTheme.icon;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-800" noValidate>
      {/* =========================================================================
          EXPLICIT DEMO AUTHENTICATION CARD ("EMAIL ID & PASSWORD") FOR EVERY PORTAL
          ========================================================================= */}
      {isDemoEnabledForThisRole && (
        <div className={`p-3.5 rounded-xl ${currentTheme.bg} border ${currentTheme.border} ${currentTheme.text} text-xs shadow-xs space-y-3`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ThemeIcon className="w-4 h-4 text-slate-700 shrink-0" />
              <div>
                <span className="font-bold text-xs block text-slate-900">
                  Demo Authentication Enabled &bull; {demoCreds.title}
                </span>
                <span className={`text-[11px] ${currentTheme.subText}`}>
                  {demoCreds.userName}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 border border-slate-200 text-slate-600">
              Demo Mode
            </span>
          </div>

          {/* Email ID & Password Display Card */}
          <div className="bg-white/95 p-2.5 rounded-lg border border-slate-200/90 space-y-2">
            {/* Email ID */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-16">
                  Email ID:
                </span>
                <code
                  onClick={() => setEmail(demoCreds.email)}
                  className="font-mono text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors truncate"
                  title="Click to fill this Email"
                >
                  {demoCreds.email}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('email', demoCreds.email)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                title="Copy Demo Email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-16">
                  Password:
                </span>
                <code
                  onClick={() => setPassword(demoCreds.password)}
                  className="font-mono text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  title="Click to fill this Password"
                >
                  {demoCreds.password}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('password', demoCreds.password)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                title="Copy Demo Password"
              >
                {copiedField === 'password' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions (Auto-Fill & 1-Click Sign In) */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Auto-Fill Credentials</span>
            </button>
            <button
              type="button"
              onClick={handleQuickSignIn}
              disabled={isLoading}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 ${currentTheme.btnBg} text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60`}
            >
              <span>1-Click Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* General Form Error */}
      {errors.general && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Work Email Field */}
      <div>
        <label htmlFor="work-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Work Email <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="work-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder={demoCreds.email}
            className={`w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Password <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-medium text-[#003B73] hover:text-[#00264D] hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#003B73] rounded"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="••••••••"
            className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
              errors.password
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-[#003B73] focus:ring-sky-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Email Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="w-4 h-4 text-[#003B73] border-slate-300 rounded focus:ring-[#003B73]"
          />
          <span className="text-xs text-slate-600 font-medium">Remember email</span>
        </label>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2.5 px-4 bg-[#003B73] hover:bg-[#002B54] active:bg-[#002244] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In to {roleTitle}</span>
        )}
      </button>
    </form>
  );
};

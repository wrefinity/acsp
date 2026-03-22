import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

type Step = 'form' | 'otp' | 'done';

const RESEND_TIMEOUT = 60;

const Register = () => {
  // Step control
  const [step, setStep] = useState<Step>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP fields
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(RESEND_TIMEOUT);
  const [resending, setResending] = useState(false);

  // Shared
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains uppercase letter', ok: /[A-Z]/.test(password) },
  ];
  const strength = checks.filter(c => c.ok).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-secondary'][strength];

  // Resend countdown timer
  useEffect(() => {
    if (step !== 'otp') return;
    setResendCountdown(RESEND_TIMEOUT);
    const t = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  // ── Step 1: Register ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      setRegisteredEmail(email);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await authAPI.verifyRegistrationOtp(registeredEmail, code);
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await authAPI.resendVerificationOtp(registeredEmail);
      setResendCountdown(RESEND_TIMEOUT);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // ── Left panel (shared) ───────────────────────────────────────────────────
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-secondary/60" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-secondary/40" />
        <div className="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-white/30" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">ACSP</span>
        </Link>
      </div>
      <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8">
          <Shield className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Join Africa's premier<br />
          <span className="text-secondary">cyber community</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-sm">
          Become a member of ACSP and connect with thousands of cybersecurity professionals across Africa.
        </p>
        <div className="space-y-4">
          {[
            'Free access to security training resources',
            'Monthly newsletter and expert insights',
            'Networking with 5,000+ practitioners',
            'Career development and certification guidance',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">5K+</p>
              <p className="text-gray-400 text-xs mt-1">Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">30+</p>
              <p className="text-gray-400 text-xs mt-1">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">100+</p>
              <p className="text-gray-400 text-xs mt-1">Events/yr</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Association of Cybersecurity Practitioners. All rights reserved.
        </p>
      </div>
    </div>
  );

  // ── Step indicator ────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-7">
      {(['form', 'otp', 'done'] as Step[]).map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-1.5 ${step === s ? 'text-primary' : (step === 'done' || (step === 'otp' && s === 'form')) ? 'text-secondary' : 'text-gray-300'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              step === s ? 'border-primary bg-primary text-white' :
              (step === 'done' || (step === 'otp' && s === 'form')) ? 'border-secondary bg-secondary text-white' :
              'border-gray-200 text-gray-400'
            }`}>
              {(step === 'done' || (step === 'otp' && s === 'form')) ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{['Details', 'Verify', 'Done'][i]}</span>
          </div>
          {i < 2 && <div className={`h-px flex-1 transition-colors ${(step === 'otp' && i === 0) || step === 'done' ? 'bg-secondary' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-primary font-bold text-lg">ACSP</span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors">← Home</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">

            {/* ── STEP: FORM ── */}
            {step === 'form' && (
              <>
                <StepIndicator />
                <div className="mb-7">
                  <h2 className="text-3xl font-bold text-primary mb-2">Create account</h2>
                  <p className="text-gray-500 text-sm">
                    Already a member?{' '}
                    <Link to="/login" className="text-secondary font-semibold hover:text-secondary-light transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name" type="text" autoComplete="name" required
                        value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jane Doe"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email" type="email" autoComplete="email" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1.5">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColor : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          {checks.map((c) => (
                            <span key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? 'text-secondary' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" /> {c.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" required
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                            : 'border-gray-200 focus:ring-secondary/40 focus:border-secondary'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2 pt-1">
                    <input id="terms" type="checkbox" required className="h-4 w-4 mt-0.5 accent-primary rounded border-gray-300 flex-shrink-0" />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
                      I agree to the{' '}
                      <a href="#" className="text-secondary font-medium hover:underline">Terms & Conditions</a>
                      {' '}and{' '}
                      <a href="#" className="text-secondary font-medium hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 mt-1"
                  >
                    {loading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating account...</>
                    ) : (
                      <>Continue <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── STEP: OTP ── */}
            {step === 'otp' && (
              <>
                <StepIndicator />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5">
                  <Mail className="h-7 w-7 text-secondary" />
                </div>

                <h2 className="text-2xl font-bold text-primary mb-2">Check your email</h2>
                <p className="text-gray-500 text-sm mb-1">
                  We sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-primary text-sm mb-6 break-all">{registeredEmail}</p>

                {error && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp}>
                  {/* OTP boxes */}
                  <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none ${
                          digit ? 'border-secondary bg-secondary/5 text-primary' : 'border-gray-200 bg-gray-50 text-gray-900'
                        } focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20`}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:-translate-y-0.5 mb-4"
                  >
                    {loading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Verifying...</>
                    ) : (
                      <>Verify email <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>

                {/* Resend + change email */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep('form'); setError(''); setOtp(['', '', '', '', '', '']); }}
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    ← Change email
                  </button>
                  {resendCountdown > 0 ? (
                    <span className="text-gray-400">Resend in {resendCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="flex items-center gap-1.5 text-secondary font-semibold hover:text-secondary/80 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                      {resending ? 'Sending...' : 'Resend code'}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ── STEP: DONE ── */}
            {step === 'done' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">Email verified!</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                  Your account has been created. An admin will review your profile and approve your membership shortly.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                >
                  Go to login <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-6 text-xs text-gray-400">You'll receive an email once your account is approved.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

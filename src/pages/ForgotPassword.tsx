import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { authAPI } from '../services/api';

type Step = 'email' | 'otp' | 'password' | 'done';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');

  // Step 1 — email
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 — OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 — new password
  const [resetSessionToken, setResetSessionToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // ── countdown timer for resend ──
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // ── Step 1: send OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setStep('otp');
      setResendCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setOtpError('');
    try {
      await authAPI.forgotPassword(email);
      setOtp(['', '', '', '', '', '']);
      setResendCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setOtpError('Failed to resend code. Please try again.');
    }
  };

  // ── OTP input handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // ── Step 2: verify OTP ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setOtpError('Please enter all 6 digits'); return; }
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await authAPI.verifyResetOtp(email, code);
      setResetSessionToken(res.resetSessionToken);
      setStep('password');
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 3: reset password ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    setPasswordError('');
    setPasswordLoading(true);
    try {
      await authAPI.resetPassword(resetSessionToken, password);
      setStep('done');
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const otpFilled = otp.every(d => d !== '');

  // ── Shared left panel ──
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/5"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full border border-white/5"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/5"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-secondary/60"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
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
          <Lock className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Secure password<br /><span className="text-secondary">reset</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-sm">
          We use a one-time verification code sent to your email — no clickable links, no phishing risk.
        </p>
        <div className="space-y-5">
          {[
            { num: '1', text: 'Enter your registered email address' },
            { num: '2', text: 'Enter the 6-digit code sent to your inbox' },
            { num: '3', text: 'Set your new secure password' },
          ].map(item => (
            <div key={item.num} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-secondary text-xs font-bold">{item.num}</span>
              </div>
              <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Association of Cybersecurity Practitioners. All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-primary font-bold text-lg">ACSP</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* ── Step progress ── */}
            {step !== 'done' && (
              <div className="flex items-center gap-2 mb-8">
                {(['email', 'otp', 'password'] as Step[]).map((s, i) => {
                  const stepIndex = ['email', 'otp', 'password'].indexOf(step);
                  const isDone = i < stepIndex;
                  const isCurrent = s === step;
                  return (
                    <React.Fragment key={s}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        isDone ? 'bg-secondary text-white' : isCurrent ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
                      </div>
                      {i < 2 && <div className={`flex-1 h-0.5 rounded ${i < stepIndex ? 'bg-secondary' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* ══════════ STEP 1: Email ══════════ */}
            {step === 'email' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-2">Forgot password?</h2>
                  <p className="text-gray-500 text-sm">Enter your email and we'll send you a 6-digit reset code.</p>
                </div>

                {emailError && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{emailError}</span>
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  >
                    {emailLoading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending code...</>
                    ) : (<>Send reset code <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">← Back to sign in</Link>
                </div>
              </>
            )}

            {/* ══════════ STEP 2: OTP ══════════ */}
            {step === 'otp' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-2">Enter reset code</h2>
                  <p className="text-gray-500 text-sm">
                    We sent a 6-digit code to <span className="font-semibold text-primary">{email}</span>.<br />
                    Check your inbox (and spam folder).
                  </p>
                </div>

                {otpError && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* 6-box OTP input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">6-digit code</label>
                    <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { inputRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:outline-none ${
                            digit
                              ? 'border-secondary bg-secondary/5 text-primary'
                              : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-secondary focus:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || !otpFilled}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  >
                    {otpLoading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Verifying...</>
                    ) : (<>Verify code <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    className="flex items-center gap-1.5 text-sm font-medium text-secondary disabled:text-gray-400 transition-colors hover:text-secondary-light"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                  </button>
                  <button onClick={() => { setStep('email'); setOtp(['','','','','','']); setOtpError(''); }} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    ← Change email
                  </button>
                </div>
              </>
            )}

            {/* ══════════ STEP 3: New Password ══════════ */}
            {step === 'password' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-2">Set new password</h2>
                  <p className="text-gray-500 text-sm">Choose a strong password for your account.</p>
                </div>

                {passwordError && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary focus:bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm new password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-200 focus:ring-secondary/40 focus:border-secondary'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  >
                    {passwordLoading ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Resetting...</>
                    ) : (<>Reset password <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </form>
              </>
            )}

            {/* ══════════ DONE ══════════ */}
            {step === 'done' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">Password reset!</h2>
                <p className="text-gray-500 mb-2">Your password has been updated successfully.</p>
                <p className="text-gray-400 text-sm mb-8">Redirecting you to sign in...</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
                >
                  Sign in now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, CheckCircle, XCircle, ArrowRight, Loader2, Mail } from 'lucide-react';

const EmailVerification = () => {
  const { token } = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) throw new Error('Verification token is missing');
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message || 'Email verified successfully. Please complete your profile.');
        setTimeout(() => navigate('/login'), 4000);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/5"></div>
          <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full border border-white/5"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/5"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-secondary/60"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-white/30"></div>
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">ACSP</span>
          </Link>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8">
            <Mail className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            One step<br />
            <span className="text-secondary">closer</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-sm">
            Verifying your email confirms your identity and activates your ACSP membership account.
          </p>
          <div className="space-y-4">
            {[
              'Secure email confirmation',
              'Instant account activation',
              'Full access to member resources',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Association of Cybersecurity Practitioners. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-primary font-bold text-lg">ACSP</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">

            {/* ── Loading ── */}
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-8 ring-4 ring-primary/10">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">Verifying your email</h2>
                <p className="text-gray-500">Please wait while we confirm your email address…</p>
              </div>
            )}

            {/* ── Success ── */}
            {status === 'success' && (
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center ring-4 ring-secondary/20">
                    <CheckCircle className="h-12 w-12 text-secondary" />
                  </div>
                  {/* Animated ping */}
                  <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping opacity-50"></span>
                </div>

                <h2 className="text-3xl font-bold text-primary mb-3">Email verified!</h2>
                <p className="text-gray-500 mb-2 max-w-xs leading-relaxed">{message}</p>
                <p className="text-gray-400 text-sm mb-10">Redirecting you to sign in…</p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full animate-[shrink_4s_linear_forwards]"
                    style={{ animation: 'width 4s linear forwards', width: '100%' }}
                  />
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Sign in now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* ── Error ── */}
            {status === 'error' && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-8 ring-4 ring-red-100">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>

                <h2 className="text-3xl font-bold text-primary mb-3">Verification failed</h2>
                <p className="text-gray-500 mb-10 max-w-xs leading-relaxed">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Link
                    to="/register"
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold py-3 px-6 rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    Re-register
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20"
                  >
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

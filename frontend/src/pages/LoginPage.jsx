import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signupRequest, verifyOtp, resendOtp, loginUser } from '../api/client';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'otp'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const otpInputsRef = useRef([]);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Cooldown timer for OTP resend
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Password strength checks
  const passwordChecks = {
    length: signupPassword.length >= 8,
    upper: /[A-Z]/.test(signupPassword),
    lower: /[a-z]/.test(signupPassword),
    number: /[0-9]/.test(signupPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword)
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await loginUser({
        email: loginEmail,
        password: loginPassword
      });

      if (res.success && res.token) {
        login(res.token, res.user);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Signup Request (Send OTP)
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isPasswordValid) {
      setErrorMessage('Please satisfy all password complexity requirements.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setLoading(true);

    try {
      const res = await signupRequest({
        fullName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword
      });

      if (res.success) {
        setSuccessMessage(res.message || 'Verification code sent to your email.');
        setActiveTab('otp');
        setCooldown(60);
        if (res.devOtp) {
          setOtpDigits(res.devOtp.split(''));
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle OTP Input Changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // 4. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await verifyOtp({
        email: signupEmail,
        otp
      });

      if (res.success && res.token) {
        setSuccessMessage('Account verified successfully! Logging you in...');
        login(res.token, res.user);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await resendOtp({ email: signupEmail });
      setSuccessMessage(res.message || 'A new verification code has been sent.');
      setCooldown(60);
      if (res.devOtp) {
        setOtpDigits(res.devOtp.split(''));
      } else {
        setOtpDigits(['', '', '', '', '', '']);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF6F0 0%, #FFE5D9 50%, #D8F3DC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        maxWidth: '480px',
        width: '100%',
        borderRadius: '28px',
        boxShadow: '0 16px 50px rgba(0,0,0,0.08)',
        border: '2px solid rgba(255, 202, 212, 0.6)',
        overflow: 'hidden'
      }}>
        
        {/* Brand Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FFCAD4 0%, #FFE5D9 100%)',
          padding: '28px 24px',
          textAlign: 'center',
          borderBottom: '1px solid #FFCAD4'
        }}>
          <div style={{
            background: '#FFFFFF',
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 6px 18px rgba(255, 202, 212, 0.6)',
            marginBottom: '10px'
          }}>
            🐾
          </div>
          <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#2B2D42', fontWeight: 800 }}>
            Paws<span style={{ color: '#E07A5F' }}>Care</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#7A3B2E', margin: '4px 0 0 0', fontWeight: 600 }}>
            Animal Rescue • Pet Adoption • Healing Platform
          </p>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        {activeTab !== 'otp' && (
          <div style={{ display: 'flex', borderBottom: '1px solid #EAEAEA' }}>
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: activeTab === 'login' ? '#FFFFFF' : '#FAF6F0',
                color: activeTab === 'login' ? '#E07A5F' : '#5C677D',
                fontWeight: activeTab === 'login' ? 800 : 600,
                fontSize: '0.95rem',
                borderBottom: activeTab === 'login' ? '3px solid #E07A5F' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: activeTab === 'signup' ? '#FFFFFF' : '#FAF6F0',
                color: activeTab === 'signup' ? '#52B788' : '#5C677D',
                fontWeight: activeTab === 'signup' ? 800 : 600,
                fontSize: '0.95rem',
                borderBottom: activeTab === 'signup' ? '3px solid #52B788' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        <div style={{ padding: '28px 24px' }}>
          
          {/* Error Banner */}
          {errorMessage && (
            <div style={{
              background: '#FEE2E2',
              border: '2px solid #EF4444',
              borderRadius: '14px',
              padding: '12px 16px',
              color: '#991B1B',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div style={{
              background: '#D8F3DC',
              border: '2px solid #74C69D',
              borderRadius: '14px',
              padding: '12px 16px',
              color: '#1B4332',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={20} color="#2D6A4F" style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. volunteer@example.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="password"
                    required
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pastel-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  fontSize: '0.95rem',
                  marginTop: '8px',
                  borderRadius: '14px'
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to PawsCare'}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.86rem', color: '#5C677D' }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                  style={{ border: 'none', background: 'none', color: '#E07A5F', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Password Strength Requirement Indicators */}
                <div style={{ background: '#FAF6F0', padding: '10px 14px', borderRadius: '12px', marginTop: '8px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, color: '#5C677D', marginBottom: '4px' }}>Password must include:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    <span style={{ color: passwordChecks.length ? '#2D6A4F' : '#8D99AE', fontWeight: passwordChecks.length ? 700 : 500 }}>
                      {passwordChecks.length ? '✓' : '•'} 8+ characters
                    </span>
                    <span style={{ color: passwordChecks.upper ? '#2D6A4F' : '#8D99AE', fontWeight: passwordChecks.upper ? 700 : 500 }}>
                      {passwordChecks.upper ? '✓' : '•'} 1 uppercase (A-Z)
                    </span>
                    <span style={{ color: passwordChecks.lower ? '#2D6A4F' : '#8D99AE', fontWeight: passwordChecks.lower ? 700 : 500 }}>
                      {passwordChecks.lower ? '✓' : '•'} 1 lowercase (a-z)
                    </span>
                    <span style={{ color: passwordChecks.number ? '#2D6A4F' : '#8D99AE', fontWeight: passwordChecks.number ? 700 : 500 }}>
                      {passwordChecks.number ? '✓' : '•'} 1 number (0-9)
                    </span>
                    <span style={{ color: passwordChecks.special ? '#2D6A4F' : '#8D99AE', fontWeight: passwordChecks.special ? 700 : 500 }}>
                      {passwordChecks.special ? '✓' : '•'} 1 special (!@#$...)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2B2D42', display: 'block', marginBottom: '6px' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <KeyRound size={18} color="#8D99AE" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pastel-mint"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  fontSize: '0.95rem',
                  marginTop: '8px',
                  borderRadius: '14px'
                }}
              >
                <span>{loading ? 'Sending Verification Code...' : 'Create Account & Verify Email'}</span>
                <ShieldCheck size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.86rem', color: '#5C677D' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  style={{ border: 'none', background: 'none', color: '#E07A5F', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: OTP VERIFICATION */}
          {activeTab === 'otp' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
              <div>
                <div style={{
                  background: '#D8F3DC',
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Mail size={28} color="#1B4332" />
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 6px 0', color: '#1B4332', fontWeight: 800 }}>
                  Enter Verification Code
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#5C677D', margin: 0 }}>
                  We sent a 6-digit verification code to: <br />
                  <strong style={{ color: '#2B2D42' }}>{signupEmail}</strong>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0' }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e.target.value)}
                    style={{
                      width: '46px',
                      height: '54px',
                      borderRadius: '14px',
                      border: '2px solid #D8F3DC',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: '#1B4332',
                      background: '#F0FFF4',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="btn-pastel-mint"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  fontSize: '0.95rem',
                  borderRadius: '14px'
                }}
              >
                <span>{loading ? 'Verifying...' : 'Verify & Complete Registration'}</span>
                <CheckCircle2 size={18} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', color: '#5C677D' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                  style={{ border: 'none', background: 'none', color: '#5C677D', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: cooldown > 0 ? '#8D99AE' : '#E07A5F',
                    fontWeight: 700,
                    cursor: cooldown > 0 ? 'default' : 'pointer',
                    padding: 0
                  }}
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Layout from '../components/Layout';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = () => {
        let strength = 0;
        if (password.length > 5) strength += 1;
        if (password.length > 7) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const strength = getPasswordStrength();
    const getBarColor = (index) => {
        if (index >= strength) return '#E2E8F0';
        if (strength <= 1) return '#EF4444';
        if (strength === 2) return '#F59E0B';
        if (strength === 3) return '#3B82F6';
        return '#22C55E';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
            });
            const data = await response.json();
            
            if (response.ok) {
                // Save token if applicable
                if (data.token) localStorage.setItem('token', data.token);
                // Redirect on success
                window.location.href = '/home-1'; 
            } else {
                setError(data.message || Object.values(data.errors || {}).join(' ') || 'Registration failed. Please check your inputs.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <style>{`
                @media (max-width: 575px) {
                    .login-card {
                        padding: 35px 20px !important;
                    }
                    .login-section {
                        padding: 90px 0 50px 0 !important;
                    }
                }
            `}</style>
            <section className="login-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F0FE 100%)', padding: '120px 0' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            
                            <div className="text-center mb-5">
                                <h1 style={{ color: '#12263A', fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1px' }}>Join the future</h1>
                                <p style={{ color: '#64748B', fontWeight: '700', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '10px' }}>
                                    Launch your whatsapp engine in minutes
                                </p>
                            </div>

                            <div className="login-card position-relative" style={{ background: '#fff', borderRadius: '24px', padding: '50px 40px', boxShadow: '0 25px 50px rgba(18, 38, 58, 0.08)' }}>
                                
                                {/* Top overlapping pill */}
                                <div className="position-absolute top-0 start-50 translate-middle text-center" style={{ zIndex: 1, width: 'max-content', maxWidth: '90%' }}>
                                    <span className="d-inline-block fw-bold text-center" style={{ background: '#22C55E', color: '#fff', padding: '10px 30px', borderRadius: '30px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                        Create Free Account
                                    </span>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3 mb-0" style={{ fontSize: '13px', borderRadius: '12px' }}>
                                        <i className="fa-solid fa-triangle-exclamation me-2"></i>{error}
                                    </div>
                                )}

                                <form className="mt-4" onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label className="d-block mb-2 text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Full Name</label>
                                        <div className="input-group" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB' }}>
                                            <span className="input-group-text bg-transparent border-0" style={{ color: '#94A3B8', paddingLeft: '20px' }}>
                                                <i className="fa-regular fa-user"></i>
                                            </span>
                                            <input type="text" required className="form-control shadow-none border-0 bg-transparent" placeholder="e.g. Ali Ahmad" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'e.g. Ali Ahmad'} style={{ padding: '16px', fontSize: '0.95rem', color: '#12263A' }} value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="d-block mb-2 text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Work Email</label>
                                        <div className="input-group" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB' }}>
                                            <span className="input-group-text bg-transparent border-0" style={{ color: '#94A3B8', paddingLeft: '20px' }}>
                                                <i className="fa-regular fa-envelope"></i>
                                            </span>
                                            <input type="email" required className="form-control shadow-none border-0 bg-transparent" placeholder="name@company.com" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'name@company.com'} style={{ padding: '16px', fontSize: '0.95rem', color: '#12263A' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group mb-2">
                                        <label className="d-block mb-2 text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Password</label>
                                        <div className="input-group" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB' }}>
                                            <span className="input-group-text bg-transparent border-0" style={{ color: '#94A3B8', paddingLeft: '20px' }}>
                                                <i className="fa-regular fa-lock"></i>
                                            </span>
                                            <input type={showPassword ? "text" : "password"} required className="form-control shadow-none border-0 bg-transparent" placeholder="••••••••" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '••••••••'} style={{ padding: '16px', fontSize: '0.95rem', color: '#12263A' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <button 
                                                type="button" 
                                                className="input-group-text bg-transparent border-0" 
                                                style={{ color: '#94A3B8', paddingRight: '20px', cursor: 'pointer' }}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    <div className="d-flex gap-1 mb-4" style={{ padding: '0 5px' }}>
                                        <div style={{ height: '4px', background: getBarColor(0), flex: '1', borderRadius: '4px', transition: 'background 0.3s' }}></div>
                                        <div style={{ height: '4px', background: getBarColor(1), flex: '1', borderRadius: '4px', transition: 'background 0.3s' }}></div>
                                        <div style={{ height: '4px', background: getBarColor(2), flex: '1', borderRadius: '4px', transition: 'background 0.3s' }}></div>
                                        <div style={{ height: '4px', background: getBarColor(3), flex: '1', borderRadius: '4px', transition: 'background 0.3s' }}></div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="d-block mb-2 text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Confirm Password</label>
                                        <div className="input-group" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB' }}>
                                            <span className="input-group-text bg-transparent border-0" style={{ color: '#94A3B8', paddingLeft: '20px' }}>
                                                <i className="fa-regular fa-lock"></i>
                                            </span>
                                            <input type="password" required className="form-control shadow-none border-0 bg-transparent" placeholder="••••••••" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '••••••••'} style={{ padding: '16px', fontSize: '0.95rem', color: '#12263A' }} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="text-center mb-4">
                                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                                            By creating an account, you agree to our <a href="/terms" style={{ color: '#22C55E', fontWeight: '700', textDecoration: 'none' }}>Terms</a> and <a href="/privacy" style={{ color: '#22C55E', fontWeight: '700', textDecoration: 'none' }}>Privacy Policy</a>.
                                        </p>
                                    </div>

                                    <button type="submit" disabled={loading} className="w-100 d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: '50px', padding: '18px 40px', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <i className="fa-solid fa-arrow-right ms-2" />
                                    </button>
                                </form>
                            </div>

                            <div className="text-center mt-4">
                                <p style={{ color: '#64748B', fontSize: '14px', fontWeight: '500' }}>
                                    Already have an account? <a href="/login" style={{ color: '#22C55E', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Login here</a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Signup;

import React, { useState } from 'react';
import Layout from '../components/Layout';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                // Save token if applicable
                if (data.token) localStorage.setItem('token', data.token);
                // Redirect on success
                window.location.href = '/home-1'; 
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="login-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F0FE 100%)', padding: '120px 0' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            
                            <div className="text-center mb-5">
                                <h1 style={{ color: '#12263A', fontWeight: '800', fontSize: '3rem', letterSpacing: '-1px' }}>Welcome back</h1>
                                <p style={{ color: '#64748B', fontWeight: '700', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '10px' }}>
                                    Access your enterprise communication portal
                                </p>
                            </div>

                            <div className="login-card position-relative" style={{ background: '#fff', borderRadius: '24px', padding: '50px 40px', boxShadow: '0 25px 50px rgba(18, 38, 58, 0.08)' }}>
                                
                                {/* Top overlapping pill */}
                                <div className="position-absolute top-0 start-50 translate-middle" style={{ zIndex: 1 }}>
                                    <span className="d-inline-block fw-bold" style={{ background: '#22C55E', color: '#fff', padding: '8px 24px', borderRadius: '30px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 10px 20px rgba(34,197,94,0.3)' }}>
                                        Secure Authentication Gateway
                                    </span>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3 mb-0" style={{ fontSize: '13px', borderRadius: '12px' }}>
                                        <i className="fa-solid fa-triangle-exclamation me-2"></i>{error}
                                    </div>
                                )}

                                <form className="mt-4" onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label className="d-block mb-2 text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Business Email</label>
                                        <div className="input-group" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB' }}>
                                            <span className="input-group-text bg-transparent border-0" style={{ color: '#94A3B8', paddingLeft: '20px' }}>
                                                <i className="fa-regular fa-envelope"></i>
                                            </span>
                                            <input type="email" required className="form-control shadow-none border-0 bg-transparent" placeholder="name@company.com" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'name@company.com'} style={{ padding: '16px', fontSize: '0.95rem', color: '#12263A' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group mb-5">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="text-uppercase mb-0" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Password</label>
                                            <a href="#" style={{ fontSize: '11px', fontWeight: '700', color: '#22C55E', textDecoration: 'none' }}>Forgot Password?</a>
                                        </div>
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

                                    <button type="submit" disabled={loading} className="w-100 d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: '50px', padding: '18px 40px', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: '0 10px 20px rgba(34,197,94,0.3)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        {loading ? 'SIGNING IN...' : 'SIGN IN SECURELY'} <i className="fa-solid fa-arrow-right ms-2" />
                                    </button>
                                </form>
                            </div>

                            <div className="text-center mt-4">
                                <p style={{ color: '#64748B', fontSize: '14px', fontWeight: '500' }}>
                                    New to Talkinexx? <a href="/signup" style={{ color: '#22C55E', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }}>Create an account</a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Login;

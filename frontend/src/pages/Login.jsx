import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/api';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            const response = await authApi.login(formData);
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg">
            <div className="auth-layout">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="auth-card-inner">
                        {/* Header */}
                        <div className="auth-header">
                            <motion.div
                                className="auth-icon auth-icon-login"
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <LogIn size={26} color="#fff" />
                            </motion.div>
                            <h1 className="auth-title">Welcome Back</h1>
                            <p className="auth-subtitle">Enter your credentials to access your dashboard</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                className="alert alert-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <AlertCircle size={17} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="form-stack">
                            <div className="field">
                                <label className="field-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label className="field-label">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                                style={{ marginTop: '0.5rem', height: '3rem' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading
                                    ? <Loader2 size={20} className="animate-spin" />
                                    : 'Sign In'
                                }
                            </motion.button>
                        </form>

                        <div className="auth-footer">
                            New here?{' '}
                            <Link to="/register">Create an account</Link>
                        </div>
                    </div>

                    <p className="auth-badge">Secure API &bull; Enterprise Ready</p>
                </motion.div>
            </div>
        </div>
    );
}

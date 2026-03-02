import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/api';
import { UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authApi.register({ email, password, full_name: fullName });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Try again.');
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
                                className="auth-icon auth-icon-register"
                                whileHover={{ rotate: -8, scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <UserPlus size={26} color="#fff" />
                            </motion.div>
                            <h1 className="auth-title">Create Account</h1>
                            <p className="auth-subtitle">Join our platform and start managing tasks</p>
                        </div>

                        {/* Alerts */}
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
                        {success && (
                            <motion.div
                                className="alert alert-success"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <CheckCircle size={17} />
                                <span>Success! Redirecting to login…</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="form-stack">
                            <div className="field">
                                <label className="field-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label className="field-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
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
                                disabled={loading || success}
                                className="btn btn-primary w-full"
                                style={{ marginTop: '0.5rem', height: '3rem' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading
                                    ? <Loader2 size={20} className="animate-spin" />
                                    : 'Create Account'
                                }
                            </motion.button>
                        </form>

                        <div className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

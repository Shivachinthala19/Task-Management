import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, taskApi } from '../api/api';
import {
    LogOut, Plus, Trash2, CheckCircle,
    User, Shield, ClipboardList, Loader2,
    AlertCircle, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchInitialData(); }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [userRes, tasksRes] = await Promise.all([authApi.getMe(), taskApi.getTasks()]);
            setUser(userRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            setError('Failed to load data. Please try logging in again.');
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        try {
            setActionLoading(true);
            const res = await taskApi.createTask(newTask);
            setTasks([res.data, ...tasks]);
            setNewTask({ title: '', description: '' });
        } catch {
            setError('Failed to create task');
        } finally {
            setActionLoading(false);
        }
    };

    const toggleTask = async (task) => {
        try {
            const updated = await taskApi.updateTask(task.id, { is_done: !task.is_done });
            setTasks(tasks.map(t => t.id === task.id ? updated.data : t));
        } catch {
            setError('Failed to update task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await taskApi.deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
        } catch {
            setError('Failed to delete task');
        }
    };

    if (loading) return (
        <div className="loading-screen page-bg">
            <Loader2 size={42} className="animate-spin text-primary" style={{ color: 'var(--primary)' }} />
            <p className="animate-pulse">Initializing Dashboard…</p>
        </div>
    );

    const isAdmin = user?.role === 'admin';

    return (
        <div className="page-bg" style={{ minHeight: '100vh' }}>

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Brand */}
                    <motion.div
                        className="nav-brand"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="nav-brand-icon">
                            <ClipboardList size={18} color="#fff" />
                        </div>
                        <span className="nav-brand-text">TaskFlow</span>
                    </motion.div>

                    {/* Right side */}
                    <motion.div
                        className="nav-right"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* User chip */}
                        <div className="nav-user-chip">
                            <div className={`nav-user-chip-icon ${isAdmin ? 'admin' : 'user'}`}>
                                {isAdmin
                                    ? <Shield size={14} />
                                    : <User size={14} />
                                }
                            </div>
                            <div className="nav-user-info">
                                <span className="nav-user-role">{user?.role}</span>
                                <span className="nav-user-name">{user?.full_name}</span>
                            </div>
                        </div>

                        {/* Logout */}
                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                            <LogOut size={17} />
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* ── Main ────────────────────────────────────── */}
            <main className="dashboard-main">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Page heading */}
                    <div className="dashboard-heading">
                        <h1>My Workspace</h1>
                        <p className="text-muted">Manage your tasks and track your productivity</p>
                    </div>

                    {/* Error banner */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="alert alert-error"
                                style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <AlertCircle size={17} />
                                    {error}
                                </span>
                                <button
                                    onClick={() => setError('')}
                                    style={{
                                        background: 'rgba(239,68,68,0.1)',
                                        border: 'none',
                                        color: '#f87171',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Create Task ──────────────────────────── */}
                    <div className="create-task-card">
                        <div className="create-task-header">
                            <div className="section-icon"><Plus size={16} /></div>
                            <h2>Add New Task</h2>
                        </div>
                        <form onSubmit={handleCreateTask} className="create-task-form">
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Task title…"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    placeholder="Description (optional)…"
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={actionLoading}
                                className="btn btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {actionLoading
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <><Plus size={17} /><span>Create</span></>
                                }
                            </motion.button>
                        </form>
                    </div>

                    {/* ── Task List ────────────────────────────── */}
                    <div className="task-list-header">
                        <div className="task-list-title">
                            <div className="section-icon"><LayoutDashboard size={16} /></div>
                            <h2>Tasks</h2>
                        </div>
                        <span className="task-count-badge">
                            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                        </span>
                    </div>

                    <div className="task-list">
                        <AnimatePresence initial={false}>
                            {tasks.length === 0 ? (
                                <motion.div
                                    className="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="empty-state-icon">
                                        <ClipboardList size={36} />
                                    </div>
                                    <h3>No tasks yet</h3>
                                    <p>Your workspace is empty. Create your first task above!</p>
                                </motion.div>
                            ) : tasks.map((task, i) => (
                                <motion.div
                                    layout
                                    key={task.id}
                                    className={`task-item ${task.is_done ? 'done' : ''}`}
                                    initial={{ opacity: 0, x: -18 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    {/* Toggle button */}
                                    <motion.button
                                        className={`task-toggle ${task.is_done ? 'done' : ''}`}
                                        onClick={() => toggleTask(task)}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.88 }}
                                        title={task.is_done ? 'Mark incomplete' : 'Mark complete'}
                                    >
                                        {task.is_done && <CheckCircle size={16} />}
                                    </motion.button>

                                    {/* Content */}
                                    <div className="task-content">
                                        <p className={`task-title ${task.is_done ? 'done' : ''}`}>{task.title}</p>
                                        {task.description && (
                                            <p className={`task-desc ${task.is_done ? 'done' : ''}`}>{task.description}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="task-actions">
                                        <button
                                            className="btn-danger-ghost"
                                            onClick={() => deleteTask(task.id)}
                                            title="Delete task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            {/* ── Status Bar ──────────────────────────────── */}
            <div className="status-bar">
                <div className="status-dot" />
                Cloud Sync Active
            </div>
        </div>
    );
}

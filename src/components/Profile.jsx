import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Save, X } from 'lucide-react';

const Profile = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        setMessage(result.message);
        if (result.success) {
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '0.5rem'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.5rem',
                        color: 'white',
                        fontWeight: '700'
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                        الملف الشخصي
                    </h2>
                </div>

                {!isEditing ? (
                    <div>
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <User size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>اسم المستخدم:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {user.username}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Mail size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>البريد الإلكتروني:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {user.email}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Calendar size={20} color="#2563eb" />
                                <span style={{ fontWeight: '600', color: '#64748b' }}>تاريخ التسجيل:</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, paddingRight: '2rem' }}>
                                {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            تعديل الملف الشخصي
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <User size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                                اسم المستخدم
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <Mail size={18} style={{ display: 'inline', marginLeft: '0.5rem' }} />
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {message && (
                            <div style={{
                                padding: '0.875rem',
                                background: message.includes('نجاح') ? '#d1fae5' : '#fee2e2',
                                border: `1px solid ${message.includes('نجاح') ? '#a7f3d0' : '#fecaca'}`,
                                borderRadius: '0.5rem',
                                color: message.includes('نجاح') ? '#065f46' : '#dc2626',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {message}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                <Save size={20} /> حفظ التغييرات
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ username: user.username, email: user.email });
                                    setMessage('');
                                }}
                                className="btn"
                                style={{ flex: 1, padding: '1rem', background: '#64748b', color: 'white' }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;

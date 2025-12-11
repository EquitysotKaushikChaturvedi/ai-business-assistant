import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function BusinessProfile() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        services: '',
        address: '',
        contact: '',
        operating_hours: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const navigate = useNavigate();

    // Load from server or local draft
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await api.get('/business/');
                setFormData(response.data);
                setIsEditing(true);
                // Clear draft if server data loaded successfully
                localStorage.removeItem('businessProfileDraft');
            } catch (err) {
                // No business found, check draft
                const draft = localStorage.getItem('businessProfileDraft');
                if (draft) {
                    setFormData(JSON.parse(draft));
                    setHasUnsavedChanges(true);
                }
                setIsEditing(false);
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, []);

    // Autosave to local storage
    useEffect(() => {
        if (hasUnsavedChanges) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem('businessProfileDraft', JSON.stringify(formData));
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [formData, hasUnsavedChanges]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setHasUnsavedChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (isEditing) {
                await api.put('/business/', formData);
            } else {
                await api.post('/business/', formData);
            }
            localStorage.removeItem('businessProfileDraft');
            setHasUnsavedChanges(false);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-textDark">
                        {isEditing ? 'Edit Business Profile' : 'Create Business Profile'}
                    </h1>
                    <p className="text-textSoft mt-1">
                        Tell the AI about your business to get tailored responses.
                    </p>
                </div>
                {hasUnsavedChanges && (
                    <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium">
                        Unsaved changes (Draft saved)
                    </span>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-textDark border-b border-gray-100 pb-2">Basic Information</h2>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-textDark mb-1">
                            Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            required
                            placeholder="e.g. Acme Solutions"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-textDark mb-1">
                            Short Description <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                maxLength={500}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                required
                                placeholder="Briefly describe what your business does..."
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-textSoft">
                                {formData.description.length}/500
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="services" className="block text-sm font-medium text-textDark mb-1">
                            Services / Products <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="services"
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            required
                            placeholder="e.g. Web Design, SEO, Marketing (comma separated)"
                        />
                        <p className="text-xs text-textSoft mt-1">
                            Tip: Separate multiple services with commas.
                        </p>
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-6 pt-6">
                    <h2 className="text-xl font-semibold text-textDark border-b border-gray-100 pb-2">Contact & Location</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-textDark mb-1">
                                Address (Optional)
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                placeholder="123 Main St, City"
                            />
                        </div>

                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-textDark mb-1">
                                Contact Info (Optional)
                            </label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={formData.contact || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                placeholder="Phone or Email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="operating_hours" className="block text-sm font-medium text-textDark mb-1">
                            Operating Hours (Optional)
                        </label>
                        <input
                            type="text"
                            id="operating_hours"
                            name="operating_hours"
                            value={formData.operating_hours || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="e.g. Mon-Fri 9am-5pm"
                        />
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex-1 bg-primary text-white py-3 rounded-xl hover:bg-secondary transition transform hover:scale-[1.01] shadow-md font-medium ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-textDark hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setStatus('error');
            setError("Please enter a valid email address.");
            return;
        }

        setStatus('submitting');
        const { error } = await supabase.auth.signInWithOtp({
            email,
        });

        if (error) {
            setStatus('error');
            setError(error.message);
        } else {
            setStatus('success');
        }
    };

    const isSubmitting = status === 'submitting';

    return (
        <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center">
            <div className="w-100 mx-auto bg-white rounded-4 shadow-lg overflow-hidden" style={{ maxWidth: '24rem' }}>
                <div className="p-5">
                    <h2 className="text-center h3 fw-bold text-dark">Login using magic link</h2>
                    <p className="text-center small text-muted mt-2">Enter your email to sign in to your account.</p>

                    {status === 'success' ? (
                        <div className="text-center p-5 bg-success-subtle rounded mt-5 border border-success-subtle">
                            {/* CheckCircleIcon removed */}
                            <h4 className="h4 fw-semibold text-success mt-4">Login Successful!</h4>
                            <p className="text-secondary mt-2">Check your email for the login link!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-5">
                            <div className="relative mb-3">
                                <label htmlFor="email" className="visually-hidden">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setStatus('idle');
                                        setError(null);
                                        setEmail(e.target.value);
                                    }}
                                    className="form-control"
                                    placeholder="you@example.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            {error && (
                                <p className="small text-danger text-center mt-2">
                                    {error}
                                </p>
                            )}

                            <div className="d-grid mt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    className="btn btn-primary btn-lg"
                                >
                                    {isSubmitting &&
                                        <span className="spinner-border spinner-border-sm text-white me-2" role="status" aria-hidden="true"></span>
                                    }
                                    {isSubmitting ? "Signing In..." : "Continue with Email"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

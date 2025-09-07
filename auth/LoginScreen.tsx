
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useBranding } from '../branding/BrandingContext';
import { BankIcon } from '../components/icons/BankIcon';
import Button from '../components/common/Button';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const { bankName, logo } = useBranding();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For this simulation, any non-empty username logs in. Password is for UI purposes only.
        if (username.trim()) {
            login(username.trim());
        }
    };

    return (
        <div className="min-h-screen font-sans bg-[--color-background] flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center justify-center gap-3 mb-6">
                    {logo ? (
                        <img src={logo} alt={`${bankName} Logo`} className="h-12 w-12 object-contain" />
                    ) : (
                        <BankIcon className="h-12 w-12 text-[--color-primary]" />
                    )}
                    <h1 className="text-3xl font-bold text-[--color-text-header]">
                        {bankName}
                    </h1>
                    <p className="text-lg text-[--color-text-body]">Expat Account Portal</p>
                </div>

                <div className="bg-[--color-background-main] p-8 rounded-2xl shadow-2xl shadow-slate-200/60 border border-black/5">
                    <h2 className="text-xl font-semibold text-center text-[--color-text-header] mb-6">Sign In</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-black">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[--color-background-main] border border-[--color-border] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring] focus:border-[--color-primary] transition-colors duration-150 text-[--color-text-header] placeholder:text-[--color-text-muted]"
                                placeholder="demo.user"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black">
                                Password
                            </label>
                             <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[--color-background-main] border border-[--color-border] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring] focus:border-[--color-primary] transition-colors duration-150 text-[--color-text-header] placeholder:text-[--color-text-muted]"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                disabled={isLoading || !username.trim()}
                                className="w-full justify-center"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
                 <footer className="text-center text-[--color-text-muted] mt-8 text-sm">
                    <p>&copy; {new Date().getFullYear()} {bankName}. All rights reserved.</p>
                    <p className="mt-1">This is a demonstration. Use any username to sign in.</p>
                </footer>
            </div>
        </div>
    );
};

export default LoginScreen;
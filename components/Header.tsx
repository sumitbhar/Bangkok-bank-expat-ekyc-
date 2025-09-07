import React from 'react';
import { BankIcon } from './icons/BankIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { useBranding } from '../branding/BrandingContext';
import { User } from '../types';

interface Props {
    onOpenBrandManager: () => void;
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<Props> = ({ onOpenBrandManager, user, onLogout }) => {
    const { bankName, logo } = useBranding();
    return (
        <header className="w-full max-w-5xl text-center relative">
             <div className="absolute top-0 left-0 p-2 hidden md:flex items-center gap-2 text-sm">
                 {user && (
                    <>
                        <span className="text-[--color-text-muted]">Welcome,</span>
                        <span className="font-semibold text-[--color-text-header]">{user.username}</span>
                        <button onClick={onLogout} className="ml-2 text-sm font-medium text-[--color-primary] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] rounded-md">
                            (Logout)
                        </button>
                    </>
                )}
            </div>
             <div className="flex items-center justify-center gap-3 mb-1 pt-12 md:pt-0">
                {logo ? (
                    <img src={logo} alt={`${bankName} Logo`} className="h-10 w-10 object-contain" />
                ) : (
                    <BankIcon className="h-10 w-10 text-[--color-primary]" />
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-[--color-text-header]">
                    {bankName}
                </h1>
            </div>
            <p className="text-base sm:text-lg text-[--color-text-body]">Expat Account eKYC Application</p>
            <button
                onClick={onOpenBrandManager}
                className="absolute top-0 right-0 p-2 text-[--color-text-muted] hover:text-[--color-primary] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] rounded-full transition-colors"
                aria-label="Open branding settings"
            >
                <SettingsIcon className="h-6 w-6" />
            </button>
        </header>
    );
};

export default Header;
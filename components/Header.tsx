import React from 'react';
import { BankIcon } from './icons/BankIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { useBranding } from '../branding/BrandingContext';

interface Props {
    onOpenBrandManager: () => void;
}

const Header: React.FC<Props> = ({ onOpenBrandManager }) => {
    const { bankName, logo } = useBranding();
    return (
        <header className="w-full max-w-4xl text-center relative">
             <div className="flex items-center justify-center gap-4 mb-2">
                {logo ? (
                    <img src={logo} alt={`${bankName} Logo`} className="h-12 w-12 object-contain" />
                ) : (
                    <BankIcon className="h-12 w-12 text-[--color-primary]" />
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-[--color-text-header]">
                    {bankName}
                </h1>
            </div>
            <p className="text-lg sm:text-xl text-[--color-text-body]">Expat Account eKYC Application</p>
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

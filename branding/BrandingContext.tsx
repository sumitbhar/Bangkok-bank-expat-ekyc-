import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { Theme, TextSize } from '../types';
import { themes, defaultTheme } from './themes';

interface BrandingState {
    bankName: string;
    logo: string | null;
    theme: Theme;
    textSize: TextSize;
    setBankName: (name: string) => void;
    setLogo: (logo: string | null) => void;
    setTheme: (theme: Theme) => void;
    setTextSize: (size: TextSize) => void;
}

const BrandingContext = createContext<BrandingState | undefined>(undefined);

const FONT_SIZE_MAP: Record<TextSize, string> = {
    sm: '14px',
    base: '16px',
    lg: '18px',
};

// Helper to get saved values from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
};

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bankName, setBankName] = useState<string>(() => getInitialState('brand:name', 'Bangkok Bank'));
    const [logo, setLogo] = useState<string | null>(() => getInitialState('brand:logo', null));
    const [theme, setTheme] = useState<Theme>(() => {
        const savedThemeName = getInitialState<string | null>('brand:theme', null);
        return themes.find(t => t.name === savedThemeName) || defaultTheme;
    });
    const [textSize, setTextSize] = useState<TextSize>(() => getInitialState('brand:textSize', 'base'));

    // Effect to save to localStorage
    useEffect(() => {
        try {
            window.localStorage.setItem('brand:name', JSON.stringify(bankName));
            window.localStorage.setItem('brand:logo', JSON.stringify(logo));
            window.localStorage.setItem('brand:theme', JSON.stringify(theme.name));
            window.localStorage.setItem('brand:textSize', JSON.stringify(textSize));
        } catch (error) {
            // Error saving to localStorage
        }
    }, [bankName, logo, theme, textSize]);

    // Effect to apply theme CSS variables
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [theme]);

    // Effect to apply text size
    useEffect(() => {
        document.documentElement.style.fontSize = FONT_SIZE_MAP[textSize];
    }, [textSize]);

    const value = useMemo(() => ({
        bankName,
        logo,
        theme,
        textSize,
        setBankName,
        setLogo,
        setTheme,
        setTextSize,
    }), [bankName, logo, theme, textSize]);

    return (
        <BrandingContext.Provider value={value}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = (): BrandingState => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
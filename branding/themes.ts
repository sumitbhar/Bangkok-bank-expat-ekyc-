import { Theme } from '../types';

const defaultColors = {
    '--color-primary': '#1E40AF', // blue-800
    '--color-primary-hover': '#1E3A8A', // blue-900
    '--color-primary-light': '#DBEAFE', // blue-100
    '--color-primary-text': '#FFFFFF',
    '--color-secondary': '#4B5563', // gray-600
    '--color-secondary-hover': '#374151', // gray-700
    '--color-text-header': '#111827', // gray-900
    '--color-text-body': '#374151', // gray-700
    '--color-text-muted': '#6B7280', // gray-500
    '--color-background': '#F3F4F6', // gray-100
    '--color-background-main': '#FFFFFF',
    '--color-surface': '#F9FAFB', // gray-50
    '--color-surface-accent': '#E5E7EB', // gray-200
    '--color-border': '#D1D5DB', // gray-300
    '--color-success': '#16A34A', // green-600
    '--color-success-bg': '#DCFCE7', // green-100
    '--color-danger': '#DC2626', // red-600
    '--color-danger-bg': '#FEE2E2', // red-100
    '--color-focus-ring': '#3B82F6', // blue-500
};

export const defaultTheme: Theme = {
    name: 'Bangkok Bank Default',
    colors: defaultColors,
};

export const themes: Theme[] = [
    defaultTheme,
    {
        name: 'Ocean Blue',
        colors: {
            ...defaultColors,
            '--color-primary': '#007BFF',
            '--color-primary-hover': '#0056b3',
            '--color-primary-light': '#cce5ff',
            '--color-focus-ring': '#007BFF',
        },
    },
    {
        name: 'Forest Green',
        colors: {
            ...defaultColors,
            '--color-primary': '#198754',
            '--color-primary-hover': '#146c43',
            '--color-primary-light': '#d1e7dd',
            '--color-focus-ring': '#198754',
        },
    },
    {
        name: 'Sunset Orange',
        colors: {
            ...defaultColors,
            '--color-primary': '#fd7e14',
            '--color-primary-hover': '#d86602',
            '--color-primary-light': '#ffeddd',
            '--color-focus-ring': '#fd7e14',
        },
    },
    {
        name: 'Royal Purple',
        colors: {
            ...defaultColors,
            '--color-primary': '#6f42c1',
            '--color-primary-hover': '#59359a',
            '--color-primary-light': '#e9dff6',
            '--color-focus-ring': '#6f42c1',
        },
    },
    {
        name: 'Navy & Gold',
        colors: {
            ...defaultColors,
            '--color-primary': '#001F54',
            '--color-primary-hover': '#00153B',
            '--color-primary-light': '#FEFBEA',
            '--color-focus-ring': '#FFC300',
        },
    },
    {
        name: 'Teal & Coral',
        colors: {
            ...defaultColors,
            '--color-primary': '#008080',
            '--color-primary-hover': '#006666',
            '--color-primary-light': '#E0F2F1',
            '--color-focus-ring': '#FF7F50',
        },
    },
    {
        name: 'Charcoal & Silver',
        colors: {
            ...defaultColors,
            '--color-primary': '#36454F',
            '--color-primary-hover': '#29363F',
            '--color-primary-light': '#F5F5F5',
            '--color-focus-ring': '#C0C0C0',
        },
    },
    {
        name: 'Mint & Peach',
        colors: {
            ...defaultColors,
            '--color-primary': '#3EB489',
            '--color-primary-hover': '#329270',
            '--color-primary-light': '#F0FFF7',
            '--color-focus-ring': '#FFDAB9',
        },
    },
    {
        name: 'Emerald & Cream',
        colors: {
            ...defaultColors,
            '--color-primary': '#009B77',
            '--color-primary-hover': '#007A5F',
            '--color-primary-light': '#E6F5F1',
            '--color-focus-ring': '#009B77',
            '--color-background': '#FAF9F6',
            '--color-surface': '#FDFBF5',
        },
    },
    {
        name: 'Plum & Sage',
        colors: {
            ...defaultColors,
            '--color-primary': '#8E4585',
            '--color-primary-hover': '#6F3668',
            '--color-primary-light': '#F6EEF5',
            '--color-focus-ring': '#9DC183',
        },
    },
    {
        name: 'Crimson & Slate',
        colors: {
            ...defaultColors,
            '--color-primary': '#DC143C',
            '--color-primary-hover': '#B81132',
            '--color-primary-light': '#FCE8EC',
            '--color-text-header': '#2F4F4F',
            '--color-text-body': '#3D5252',
            '--color-focus-ring': '#DC143C',
        },
    },
    {
        name: 'Mocha & Latte',
        colors: {
            ...defaultColors,
            '--color-primary': '#4A2C2A',
            '--color-primary-hover': '#3B2321',
            '--color-primary-light': '#F2E5D5',
            '--color-background': '#F9F5EF',
            '--color-surface': '#FDFBF5',
            '--color-focus-ring': '#8B4513',
        },
    },
    {
        name: 'Sapphire & Ivory',
        colors: {
            ...defaultColors,
            '--color-primary': '#0F52BA',
            '--color-primary-hover': '#0C4195',
            '--color-primary-light': '#E7EEF8',
            '--color-background': '#FFFFF0',
            '--color-surface': '#FCFCF5',
            '--color-focus-ring': '#0F52BA',
        },
    },
    {
        name: 'Rose Gold',
        colors: {
            ...defaultColors,
            '--color-primary': '#B76E79',
            '--color-primary-hover': '#9F5964',
            '--color-primary-light': '#FDEEF0',
            '--color-focus-ring': '#B76E79',
        },
    },
    {
        name: 'Tangerine & Aqua',
        colors: {
            ...defaultColors,
            '--color-primary': '#F28500',
            '--color-primary-hover': '#D67600',
            '--color-primary-light': '#FFF3E6',
            '--color-focus-ring': '#40E0D0',
        },
    },
    {
        name: 'Lavender Fields',
        colors: {
            ...defaultColors,
            '--color-primary': '#967BB6',
            '--color-primary-hover': '#7E6299',
            '--color-primary-light': '#F6F4F9',
            '--color-focus-ring': '#967BB6',
        },
    },
    {
        name: 'Slate & Copper',
        colors: {
            ...defaultColors,
            '--color-primary': '#6A5ACD',
            '--color-primary-hover': '#5548A8',
            '--color-primary-light': '#F0EEFA',
            '--color-focus-ring': '#B87333',
        },
    },
    {
        name: 'High Contrast',
        colors: {
            ...defaultColors,
            '--color-primary': '#000000',
            '--color-primary-hover': '#333333',
            '--color-primary-light': '#E0E0E0',
            '--color-background': '#FFFFFF',
            '--color-background-main': '#FFFFFF',
            '--color-surface': '#F5F5F5',
            '--color-border': '#999999',
            '--color-text-header': '#000000',
            '--color-text-body': '#111111',
            '--color-focus-ring': '#000000',
        },
    },
    {
        name: 'Terracotta Earth',
        colors: {
            ...defaultColors,
            '--color-primary': '#A0522D',
            '--color-primary-hover': '#8B4513',
            '--color-primary-light': '#F9EBE2',
            '--color-focus-ring': '#E2725B',
        },
    },
    {
        name: 'Classic Burgundy',
        colors: {
            ...defaultColors,
            '--color-primary': '#800020',
            '--color-primary-hover': '#66001A',
            '--color-primary-light': '#FDE7EB',
            '--color-focus-ring': '#800020',
        },
    },
];

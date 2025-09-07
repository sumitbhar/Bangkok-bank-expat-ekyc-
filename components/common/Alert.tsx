
import React from 'react';
import { XCircleIcon } from '../icons/XCircleIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { InfoIcon } from '../icons/InfoIcon';

type AlertType = 'error' | 'success' | 'info';

interface Props {
    type: AlertType;
    title: string;
    message: string;
}

const ICONS: Record<AlertType, React.ElementType> = {
    error: XCircleIcon,
    success: CheckCircleIcon,
    info: InfoIcon,
};

const STYLES: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
    error: {
        bg: 'bg-[--color-danger-bg]',
        border: 'border-[--color-danger]',
        text: 'text-[--color-danger]',
        icon: 'text-[--color-danger]',
    },
    success: {
        bg: 'bg-[--color-success-bg]',
        border: 'border-[--color-success]',
        text: 'text-green-800',
        icon: 'text-[--color-success]',
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-800',
        icon: 'text-blue-500',
    },
};

const Alert: React.FC<Props> = ({ type, title, message }) => {
    const Icon = ICONS[type];
    const styles = STYLES[type];

    return (
        <div className={`p-4 border-l-4 rounded-r-lg ${styles.bg} ${styles.border}`} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${styles.icon}`} aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className={`text-sm font-bold ${styles.text}`}>{title}</h3>
                    <p className={`mt-1 text-sm ${styles.text}`}>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Alert;


import React from 'react';
import { ButtonVariant } from '../../types';
import { SpinnerIcon } from '../icons/SpinnerIcon';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariant;
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<Props> = ({ variant, isLoading = false, children, className = '', ...props }) => {
    const baseClasses = "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none";

    const variantClasses: Record<ButtonVariant, string> = {
        primary: "text-[--color-primary-text] bg-[--color-primary] hover:bg-[--color-primary-hover] focus:ring-[--color-focus-ring]",
        secondary: "text-[--color-text-body] bg-[--color-surface-accent] hover:bg-[--color-border] focus:ring-[--color-focus-ring]",
        success: "text-white bg-[--color-success] hover:bg-[--color-success-hover] focus:ring-green-500",
        danger: "text-white bg-[--color-danger] hover:bg-red-700 focus:ring-red-500",
        warning: "text-white bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
    };

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <button className={combinedClassName} disabled={isLoading || props.disabled} {...props}>
            {isLoading && <SpinnerIcon className="h-5 w-5" />}
            {children}
        </button>
    );
};

export default Button;

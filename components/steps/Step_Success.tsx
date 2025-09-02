import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Props {
    startOver: () => void;
}

const StepSuccess: React.FC<Props> = ({ startOver }) => {
    return (
        <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
            <CheckCircleIcon className="w-20 h-20 text-[--color-success] mb-4" />
            <h2 className="text-2xl font-bold text-[--color-text-header] mb-2">Application Submitted!</h2>
            <p className="text-[--color-text-body] mb-6 max-w-md">
                Thank you! Your eKYC application has been successfully submitted. You will receive an email confirmation shortly with your reference number.
            </p>
            <button
                type="button"
                onClick={startOver}
                className="px-6 py-2 text-sm font-medium text-[--color-primary-text] bg-[--color-primary] rounded-lg hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring]"
            >
                Start New Application
            </button>
        </div>
    );
};

export default StepSuccess;

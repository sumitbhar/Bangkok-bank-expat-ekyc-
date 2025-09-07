
import React from 'react';
import { EKYCStep, StepStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { UserIcon } from './icons/UserIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { CameraIcon } from './icons/CameraIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ReviewIcon } from './icons/ReviewIcon';
import { UserCheckIcon } from './icons/UserCheckIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface Step {
    id: EKYCStep;
    title: string;
}

interface StepperProps {
    steps: Step[];
    getStepStatus: (stepId: EKYCStep) => StepStatus;
    goToStep: (step: EKYCStep) => void;
}

const stepIcons: Record<EKYCStep, React.ElementType> = {
    [EKYCStep.PersonalInfo]: UserIcon,
    [EKYCStep.Documents]: DocumentIcon,
    [EKYCStep.Liveness]: CameraIcon,
    [EKYCStep.ImageVerification]: UserCheckIcon,
    [EKYCStep.Address]: HomeIcon,
    [EKYCStep.FinancialInfo]: BriefcaseIcon,
    [EKYCStep.TermsAndConditions]: ClipboardDocumentCheckIcon,
    [EKYCStep.Review]: ReviewIcon,
    [EKYCStep.Success]: CheckIcon,
};


const Stepper: React.FC<StepperProps> = ({ steps, getStepStatus, goToStep }) => {
    return (
        <nav>
            <style>{`
                @keyframes checkmark-pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-checkmark-pop-in {
                    animation: checkmark-pop-in 0.3s ease-out both;
                }
            `}</style>
            <ul className="space-y-0">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    const Icon = stepIcons[step.id];
                    const isCompleted = status === StepStatus.COMPLETED;
                    const isCurrent = status === StepStatus.CURRENT;
                    
                    const canNavigate = isCompleted && !isCurrent;

                    const containerStyle = isCurrent 
                        ? 'bg-[--color-primary-light] border-[--color-primary]' 
                        : isCompleted
                            ? 'bg-[--color-background-main] border-transparent'
                            : 'bg-transparent border-transparent';
                            
                    const iconContainerStyle = isCompleted || isCurrent
                        ? 'bg-[--color-primary] text-[--color-primary-text]'
                        : 'bg-[--color-border] text-[--color-text-muted]';

                    const textStyle = isCurrent 
                        ? 'text-[--color-primary] font-bold' 
                        : isCompleted
                            ? 'text-[--color-text-header] font-medium'
                            : 'text-[--color-text-muted]';

                    const lineStyle = isCompleted ? 'bg-[--color-primary]' : 'bg-[--color-border]';

                    const IconComponent = isCompleted ? CheckIcon : Icon;
                    const iconClassName = `h-6 w-6 ${isCompleted ? 'animate-checkmark-pop-in' : ''}`;

                    return (
                         <li key={step.id} className="relative pl-[3.25rem]">
                            {/* Vertical line */}
                             {index !== steps.length - 1 && (
                                <div className={`absolute left-[29px] top-11 h-full w-0.5 ${lineStyle} transition-colors duration-300`} aria-hidden="true" />
                             )}
                            <button
                                onClick={() => canNavigate && goToStep(step.id)}
                                disabled={!canNavigate}
                                className={`w-full flex items-center p-3 rounded-lg border-2 transition-all duration-200 mb-2 ${containerStyle} ${canNavigate ? 'hover:border-[--color-primary] hover:bg-[--color-primary-light]' : 'cursor-default'}`}
                            >
                                <div className={`absolute left-0 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 z-10 ${iconContainerStyle}`}>
                                    <IconComponent className={iconClassName} />
                                </div>
                                <span className={`text-base ${textStyle}`}>
                                    {step.title}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Stepper;
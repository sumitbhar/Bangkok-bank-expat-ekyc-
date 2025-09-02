import React from 'react';
import { EKYCStep, StepStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { DotIcon } from './icons/DotIcon';
import { UserIcon } from './icons/UserIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { CameraIcon } from './icons/CameraIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ReviewIcon } from './icons/ReviewIcon';
import { UserCheckIcon } from './icons/UserCheckIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon';

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
    [EKYCStep.TermsAndConditions]: ClipboardDocumentCheckIcon,
    [EKYCStep.Review]: ReviewIcon,
    [EKYCStep.Success]: CheckIcon,
};


const Stepper: React.FC<StepperProps> = ({ steps, getStepStatus, goToStep }) => {
    return (
        <nav>
            <ul className="space-y-4">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    const Icon = stepIcons[step.id];
                    const isCompleted = status === StepStatus.COMPLETED;

                    const iconColor = isCompleted 
                        ? 'bg-[--color-primary] text-[--color-primary-text]' 
                        : status === StepStatus.CURRENT 
                            ? 'bg-[--color-primary-light] text-[--color-primary]' 
                            : 'bg-[--color-surface-accent] text-[--color-text-muted]';

                    const textColor = status === StepStatus.CURRENT 
                        ? 'text-[--color-primary] font-bold' 
                        : isCompleted 
                            ? 'text-[--color-text-body]' 
                            : 'text-[--color-text-muted]';
                            
                    const lineStyle = isCompleted ? 'bg-[--color-primary]' : 'bg-[--color-surface-accent]';

                    return (
                        <li key={step.id} className="relative flex items-start group">
                            {index !== steps.length - 1 && (
                                <div className={`absolute left-5 top-12 -ml-px h-full w-0.5 ${lineStyle}`} aria-hidden="true" />
                            )}
                            <div className="flex items-center space-x-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconColor} transition-colors duration-300`}>
                                    {isCompleted ? <CheckIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                </div>
                                <button
                                    onClick={() => isCompleted && goToStep(step.id)}
                                    disabled={!isCompleted}
                                    className={`text-lg text-left ${textColor} ${isCompleted ? 'cursor-pointer hover:text-[--color-primary]' : 'cursor-default'}`}
                                >
                                    {step.title}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Stepper;
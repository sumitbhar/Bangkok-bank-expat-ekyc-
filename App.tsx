

import React, { useState, useCallback, useEffect } from 'react';
import { EKYCStep, FormData, StepStatus, User } from './types';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Step1PersonalInfo from './components/steps/Step1_PersonalInfo';
import Step2Documents from './components/steps/Step2_Documents';
import Step3Liveness from './components/steps/Step3_Liveness';
import Step3_5_ImageVerification from './components/steps/Step3_5_ImageVerification';
import Step4Address from './components/steps/Step4_Address';
import Step_FinancialInfo from './components/steps/Step_FinancialInfo';
import Step_TermsAndConditions from './components/steps/Step_TermsAndConditions';
import Step5Review from './components/steps/Step5_Review';
import StepSuccess from './components/steps/Step_Success';
import BrandManager from './components/BrandManager';
import { useAuth } from './auth/AuthContext';
import LoginScreen from './auth/LoginScreen';
import * as backend from './services/backendService';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import SessionTimeout from './auth/SessionTimeout';
import WhatsNewModal from './components/WhatsNewModal';


const initialFormData: FormData = {
    personalInfo: {
        fullName: '',
        nationality: '',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
    },
    documents: {
        passport: null,
    },
    liveness: {
        selfie: null,
    },
    imageVerification: {
        profilePicture: null,
    },
    address: {
        bangkokAddress: '',
        homeCountryAddress: '',
    },
    financialInfo: {
        employmentStatus: '',
        sourceOfFunds: '',
        monthlyTransactions: '',
    },
};

const STEPS = [
    { id: EKYCStep.Documents, title: 'Upload Passport' },
    { id: EKYCStep.PersonalInfo, title: 'Verify Information' },
    { id: EKYCStep.Liveness, title: 'Liveness Check' },
    { id: EKYCStep.ImageVerification, title: 'Photo Verification' },
    { id: EKYCStep.Address, title: 'Address' },
    { id: EKYCStep.FinancialInfo, title: 'Financial Info' },
    { id: EKYCStep.TermsAndConditions, title: 'Terms & Conditions' },
    { id: EKYCStep.Review, title: 'Review & Submit' },
];

const App: React.FC = () => {
    const { user, isAuthenticated, logout, isLoading: isAuthLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState<EKYCStep>(EKYCStep.Documents);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isBrandManagerOpen, setIsBrandManagerOpen] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);

    // Effect to load application data when user logs in
    useEffect(() => {
        if (isAuthenticated && user) {
            setIsAppLoading(true);
            backend.loadApplication(user.username)
                .then(savedState => {
                    if (savedState) {
                        setFormData(savedState.data);
                        setCurrentStep(savedState.step);
                    } else {
                        setFormData(initialFormData);
                        setCurrentStep(EKYCStep.Documents);
                    }
                })
                .finally(() => setIsAppLoading(false));
        }
    }, [isAuthenticated, user]);

    // Effect to auto-save application data on change
    useEffect(() => {
        if (isAuthenticated && user && !isAppLoading && currentStep !== EKYCStep.Success) {
            backend.saveApplication(user.username, { data: formData, step: currentStep });
        }
    }, [formData, currentStep, isAuthenticated, user, isAppLoading]);
    
    const updateFormData = useCallback((data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    const nextStep = useCallback(() => {
        const currentIndex = STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentIndex + 1].id);
        } else if (currentStep === EKYCStep.Review) {
            setCurrentStep(EKYCStep.Success);
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        const currentIndex = STEPS.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1].id);
        }
    }, [currentStep]);

    const goToStep = useCallback((step: EKYCStep) => {
        const targetIndex = STEPS.findIndex(s => s.id === step);
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        // Allow navigation only to previously completed steps
        if (targetIndex < currentIndex) {
             setCurrentStep(step);
        }
    }, [currentStep]);
    
    const jumpToStep = useCallback((step: EKYCStep) => {
        setCurrentStep(step);
    }, []);

    const handleLogout = useCallback(async () => {
        await logout();
        setCurrentStep(EKYCStep.Documents);
        setFormData(initialFormData);
    }, [logout]);


    const renderStep = () => {
        switch (currentStep) {
            case EKYCStep.Documents:
                return <Step2Documents nextStep={nextStep} updateFormData={updateFormData} />;
            case EKYCStep.PersonalInfo:
                return <Step1PersonalInfo nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case EKYCStep.Liveness:
                return <Step3Liveness nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} />;
            case EKYCStep.ImageVerification:
                return <Step3_5_ImageVerification nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case EKYCStep.Address:
                return <Step4Address nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case EKYCStep.FinancialInfo:
                return <Step_FinancialInfo nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case EKYCStep.TermsAndConditions:
                return <Step_TermsAndConditions nextStep={nextStep} prevStep={prevStep} />;
            case EKYCStep.Review:
                return <Step5Review nextStep={nextStep} prevStep={prevStep} formData={formData} jumpToStep={jumpToStep} user={user} />;
            case EKYCStep.Success:
                return <StepSuccess logout={handleLogout} formData={formData} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    const getStepStatus = (stepId: EKYCStep): StepStatus => {
        const stepIndex = STEPS.findIndex(s => s.id === stepId);
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        
        if (currentStep === EKYCStep.Success) return StepStatus.COMPLETED;
        if (stepIndex < currentIndex) return StepStatus.COMPLETED;
        if (stepIndex === currentIndex) return StepStatus.CURRENT;
        return StepStatus.UPCOMING;
    };
    
    if (isAuthLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[--color-background]"><SpinnerIcon className="h-12 w-12 text-[--color-primary]" /></div>;
    }

    if (!isAuthenticated) {
        return <LoginScreen />;
    }
    
    if (isAppLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-[--color-background]">
                 <Header user={user} onLogout={handleLogout} onOpenBrandManager={() => setIsBrandManagerOpen(true)} />
                 <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <SpinnerIcon className="h-12 w-12 text-[--color-primary] mx-auto" />
                        <p className="mt-2 font-semibold text-[--color-text-header]">Loading your application...</p>
                    </div>
                 </main>
            </div>
        );
    }

    return (
        <>
          <SessionTimeout onIdle={handleLogout} />
          <WhatsNewModal />
          {isBrandManagerOpen && <BrandManager onClose={() => setIsBrandManagerOpen(false)} />}
          <div className="min-h-screen font-sans text-[--color-text-body] bg-[--color-background] flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
              <Header user={user} onLogout={handleLogout} onOpenBrandManager={() => setIsBrandManagerOpen(true)} />
               <style>{`
                @keyframes slide-fade-in {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-fade-in {
                    animation: slide-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
                @keyframes step-fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-step-fade-in {
                    animation: step-fade-in 0.4s ease-in-out both;
                }
              `}</style>
              <main className="w-full max-w-5xl bg-[--color-background-main] rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden mt-8 flex flex-col md:flex-row border border-black/5 animate-slide-fade-in">
                   <div className="w-full md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-[--color-border] bg-[--color-surface-accent]">
                     <h2 className="text-xl font-bold text-[--color-text-header] mb-8">Application Steps</h2>
                     <Stepper steps={STEPS} getStepStatus={getStepStatus} goToStep={goToStep} />
                   </div>
                   <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-12">
                       <div key={currentStep} className="animate-step-fade-in">
                           {renderStep()}
                       </div>
                   </div>
              </main>
              <footer className="text-center text-[--color-text-muted] mt-8 pt-6 text-sm border-t border-[--color-border] w-full max-w-5xl">
                  <p>&copy; {new Date().getFullYear()} Bangkok Bank. All rights reserved.</p>
                  <p className="mt-1">This is a demonstration app. Do not use real personal information.</p>
              </footer>
          </div>
        </>
    );
};

export default App;
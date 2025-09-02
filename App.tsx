import React, { useState, useCallback, useEffect } from 'react';
import { EKYCStep, FormData, StepStatus } from './types';
import Header from './components/Header';
import Stepper from './components/Stepper';
import Step1PersonalInfo from './components/steps/Step1_PersonalInfo';
import Step2Documents from './components/steps/Step2_Documents';
import Step3Liveness from './components/steps/Step3_Liveness';
import Step3_5_ImageVerification from './components/steps/Step3_5_ImageVerification';
import Step4Address from './components/steps/Step4_Address';
import Step_TermsAndConditions from './components/steps/Step_TermsAndConditions';
import Step5Review from './components/steps/Step5_Review';
import StepSuccess from './components/steps/Step_Success';
import BrandManager from './components/BrandManager';

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
};

const getInitialFormData = (): FormData => {
    try {
        const savedData = localStorage.getItem('ekycFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Basic validation to ensure it's not stale/corrupted data
            if (parsedData.personalInfo && parsedData.documents) {
                return parsedData;
            }
        }
    } catch (error) {
        console.error("Failed to read form data from localStorage", error);
    }
    return initialFormData;
};


const STEPS = [
    { id: EKYCStep.Documents, title: 'Upload Passport' },
    { id: EKYCStep.PersonalInfo, title: 'Verify Information' },
    { id: EKYCStep.Liveness, title: 'Liveness Check' },
    { id: EKYCStep.ImageVerification, title: 'Photo Verification' },
    { id: EKYCStep.Address, title: 'Address' },
    { id: EKYCStep.TermsAndConditions, title: 'Terms & Conditions' },
    { id: EKYCStep.Review, title: 'Review & Submit' },
];

const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<EKYCStep>(EKYCStep.Documents);
    const [formData, setFormData] = useState<FormData>(getInitialFormData);
    const [isBrandManagerOpen, setIsBrandManagerOpen] = useState(false);
    
    useEffect(() => {
        try {
            localStorage.setItem('ekycFormData', JSON.stringify(formData));
        } catch (error) {
            console.error("Failed to save form data to localStorage", error);
        }
    }, [formData]);
    
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
        if (targetIndex < currentIndex) {
             setCurrentStep(step);
        }
    }, [currentStep]);
    
    const jumpToStep = useCallback((step: EKYCStep) => {
        setCurrentStep(step);
    }, []);

    const startOver = useCallback(() => {
        setFormData(initialFormData);
        setCurrentStep(EKYCStep.Documents);
         try {
            localStorage.removeItem('ekycFormData');
        } catch (error) {
            console.error("Failed to clear form data from localStorage", error);
        }
    }, []);

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
            case EKYCStep.TermsAndConditions:
                return <Step_TermsAndConditions nextStep={nextStep} prevStep={prevStep} />;
            case EKYCStep.Review:
                return <Step5Review nextStep={nextStep} prevStep={prevStep} formData={formData} jumpToStep={jumpToStep} />;
            case EKYCStep.Success:
                return <StepSuccess startOver={startOver} />;
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

    return (
        <>
          {isBrandManagerOpen && <BrandManager onClose={() => setIsBrandManagerOpen(false)} />}
          <div className="min-h-screen font-sans text-[--color-text-body] bg-[--color-background] flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
              <Header onOpenBrandManager={() => setIsBrandManagerOpen(true)} />
              <main className="w-full max-w-4xl bg-[--color-background-main] rounded-2xl shadow-2xl overflow-hidden mt-8 flex flex-col md:flex-row">
                   <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-[--color-border] bg-[--color-surface]">
                     <h2 className="text-xl font-bold text-[--color-text-header] mb-6">Application Steps</h2>
                     <Stepper steps={STEPS} getStepStatus={getStepStatus} goToStep={goToStep} />
                   </div>
                   <div className="w-full md:w-2/3 p-6 sm:p-8 md:p-12">
                       {renderStep()}
                   </div>
              </main>
              <footer className="text-center text-gray-500 mt-8 text-sm">
                  <p>&copy; {new Date().getFullYear()} Bangkok Bank. All rights reserved.</p>
                  <p className="mt-1">This is a demonstration app. Do not use real personal information.</p>
              </footer>
          </div>
        </>
    );
};

export default App;
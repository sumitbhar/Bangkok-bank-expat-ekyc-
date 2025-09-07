
import React, { useState } from 'react';
import { FormData, EKYCStep, User } from '../../types';
import { EditIcon } from '../icons/EditIcon';
import * as backend from '../../services/backendService';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    jumpToStep: (step: EKYCStep) => void;
    user: User | null;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-[--color-text-muted]">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-[--color-text-header] sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

const SectionHeader: React.FC<{ title: string; onEdit: () => void }> = ({ title, onEdit }) => (
    <div className="flex justify-between items-center pb-2 mb-2">
        <h3 className="text-lg font-semibold text-[--color-text-header]">{title}</h3>
        <button 
            onClick={onEdit} 
            className="flex items-center gap-1.5 text-sm font-semibold text-[--color-primary] hover:text-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] rounded-md px-2 py-1"
            aria-label={`Edit ${title}`}
        >
            <EditIcon className="h-4 w-4" />
            Edit
        </button>
    </div>
);

const ReviewCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-[--color-surface] p-6 rounded-xl border border-[--color-border] transition-all duration-300 hover:shadow-lg hover:border-black/10 hover:-translate-y-1">
        {children}
    </div>
);


const Step5Review: React.FC<Props> = ({ nextStep, prevStep, formData, jumpToStep, user }) => {
    const { personalInfo, documents, liveness, address, imageVerification, financialInfo } = formData;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!user) {
            setSubmitError("User not found. Please log in again.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const result = await backend.submitApplication(user.username, formData);
            if (result.success) {
                nextStep();
            } else {
                setSubmitError("Failed to submit application. Please try again.");
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Review Your Application</h2>
            <p className="text-[--color-text-body] mb-8">Please carefully review all the information below. If anything is incorrect, please go back and edit it.</p>
            
            <div className="space-y-8">
                {/* Personal Info */}
                <ReviewCard>
                    <SectionHeader title="Personal Information" onEdit={() => jumpToStep(EKYCStep.PersonalInfo)} />
                    <dl className="divide-y divide-[--color-border]">
                        <InfoRow label="Full Name" value={personalInfo.fullName} />
                        <InfoRow label="Nationality" value={personalInfo.nationality} />
                        <InfoRow label="Date of Birth" value={personalInfo.dob} />
                        <InfoRow label="Passport Number" value={personalInfo.passportNumber} />
                        <InfoRow label="Passport Expiry" value={personalInfo.passportExpiry} />
                    </dl>
                </ReviewCard>

                {/* Address Info */}
                <ReviewCard>
                     <SectionHeader title="Address Information" onEdit={() => jumpToStep(EKYCStep.Address)} />
                     <dl className="divide-y divide-[--color-border]">
                        <InfoRow label="Bangkok Address" value={address.bangkokAddress} />
                        <InfoRow label="Home Country Address" value={address.homeCountryAddress} />
                    </dl>
                </ReviewCard>
                
                 {/* Financial Info */}
                <ReviewCard>
                    <SectionHeader title="Financial Information" onEdit={() => jumpToStep(EKYCStep.FinancialInfo)} />
                    <dl className="divide-y divide-[--color-border]">
                        <InfoRow label="Employment Status" value={financialInfo.employmentStatus} />
                        <InfoRow label="Source of Funds" value={financialInfo.sourceOfFunds} />
                        <InfoRow label="Expected Transactions" value={financialInfo.monthlyTransactions} />
                    </dl>
                </ReviewCard>

                {/* Documents */}
                <ReviewCard>
                    <SectionHeader title="Documents & Photos" onEdit={() => jumpToStep(EKYCStep.Liveness)} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Passport Scan</p>
                            {documents.passport ? <img src={documents.passport} alt="Passport" className="rounded-lg shadow-sm w-full border border-[--color-border]" /> : <p>Not provided</p>}
                        </div>
                        <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Selfie</p>
                            {liveness.selfie ? <img src={liveness.selfie} alt="Selfie" className="rounded-lg shadow-sm w-full transform -scale-x-100 border border-[--color-border]" /> : <p>Not provided</p>}
                        </div>
                         <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Profile Photo</p>
                            {imageVerification.profilePicture ? <img src={imageVerification.profilePicture} alt="Profile" className="rounded-lg shadow-sm w-full border border-[--color-border]" /> : <p>Not provided</p>}
                        </div>
                    </div>
                </ReviewCard>
            </div>
            
            {submitError && <div className="mt-4"><Alert type="error" title="Submission Error" message={submitError} /></div>}

            <div className="flex justify-between pt-8">
                <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                <Button
                    type="button"
                    variant="success"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Submit Application
                </Button>
            </div>
        </div>
    );
};

export default Step5Review;
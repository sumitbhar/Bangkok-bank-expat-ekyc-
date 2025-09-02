import React from 'react';
import { FormData, EKYCStep } from '../../types';
import { EditIcon } from '../icons/EditIcon';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    jumpToStep: (step: EKYCStep) => void;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-[--color-text-muted]">{label}</dt>
        <dd className="mt-1 text-sm text-[--color-text-body] sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

const SectionHeader: React.FC<{ title: string; onEdit: () => void }> = ({ title, onEdit }) => (
    <div className="flex justify-between items-center border-b border-[--color-border] pb-2 mb-2">
        <h3 className="text-lg font-semibold text-[--color-text-header]">{title}</h3>
        <button 
            onClick={onEdit} 
            className="flex items-center gap-1.5 text-sm text-[--color-primary] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] rounded-md px-2 py-1"
            aria-label={`Edit ${title}`}
        >
            <EditIcon className="h-4 w-4" />
            Edit
        </button>
    </div>
);


const Step5Review: React.FC<Props> = ({ nextStep, prevStep, formData, jumpToStep }) => {
    const { personalInfo, documents, liveness, address, imageVerification } = formData;
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[--color-text-header] mb-2">Review Your Application</h2>
            <p className="text-[--color-text-body] mb-6">Please carefully review all the information below. If anything is incorrect, please go back and edit it.</p>
            
            <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-[--color-surface] p-4 rounded-lg border border-[--color-border]">
                    <SectionHeader title="Personal Information" onEdit={() => jumpToStep(EKYCStep.PersonalInfo)} />
                    <dl className="divide-y divide-[--color-border]">
                        <InfoRow label="Full Name" value={personalInfo.fullName} />
                        <InfoRow label="Nationality" value={personalInfo.nationality} />
                        <InfoRow label="Date of Birth" value={personalInfo.dob} />
                        <InfoRow label="Passport Number" value={personalInfo.passportNumber} />
                        <InfoRow label="Passport Expiry" value={personalInfo.passportExpiry} />
                    </dl>
                </div>

                {/* Address Info */}
                <div className="bg-[--color-surface] p-4 rounded-lg border border-[--color-border]">
                     <SectionHeader title="Address Information" onEdit={() => jumpToStep(EKYCStep.Address)} />
                     <dl className="divide-y divide-[--color-border]">
                        <InfoRow label="Bangkok Address" value={address.bangkokAddress} />
                        <InfoRow label="Home Country Address" value={address.homeCountryAddress} />
                    </dl>
                </div>

                {/* Documents */}
                <div className="bg-[--color-surface] p-4 rounded-lg border border-[--color-border]">
                    <SectionHeader title="Documents & Photos" onEdit={() => jumpToStep(EKYCStep.Documents)} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Passport Scan</p>
                            {documents.passport ? <img src={documents.passport} alt="Passport" className="rounded-lg shadow-md w-full" /> : <p>Not provided</p>}
                        </div>
                        <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Selfie</p>
                            {liveness.selfie ? <img src={liveness.selfie} alt="Selfie" className="rounded-lg shadow-md w-full transform -scale-x-100" /> : <p>Not provided</p>}
                        </div>
                         <div>
                            <p className="font-medium text-[--color-text-body] mb-2">Profile Photo</p>
                            {imageVerification.profilePicture ? <img src={imageVerification.profilePicture} alt="Profile" className="rounded-lg shadow-md w-full" /> : <p>Not provided</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-medium text-[--color-text-body] bg-[--color-surface-accent] rounded-lg hover:bg-[--color-border] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring]">
                    Back
                </button>
                <button type="button" onClick={nextStep} className="px-6 py-2 text-sm font-medium text-white bg-[--color-success] rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Submit Application
                </button>
            </div>
        </div>
    );
};

export default Step5Review;

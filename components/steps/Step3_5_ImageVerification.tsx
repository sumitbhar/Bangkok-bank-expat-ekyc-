import React, { useState, useCallback } from 'react';
import { FormData } from '../../types';
import { compareFaces } from '../../services/geminiService';
import { UploadIcon } from '../icons/UploadIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'failure';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const Step3_5_ImageVerification: React.FC<Props> = ({ nextStep, prevStep, formData, updateFormData }) => {
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setVerificationStatus('idle');
        setVerificationMessage('');
        
        try {
            const dataUrl = await fileToDataUrl(file);
            updateFormData({ imageVerification: { profilePicture: dataUrl } });
        } catch (err) {
            setError('Could not read the selected file.');
        }
    }, [updateFormData]);

    const handleVerification = useCallback(async () => {
        if (!formData.liveness.selfie || !formData.imageVerification.profilePicture) {
            setError("Selfie or profile picture is missing.");
            return;
        }

        setVerificationStatus('verifying');
        setError(null);
        setVerificationMessage('');

        try {
            const result = await compareFaces(formData.liveness.selfie, formData.imageVerification.profilePicture);
            if (result.match) {
                setVerificationStatus('success');
                setVerificationMessage('Verification successful.');
                // Photo is already in formData, no need to update again.
            } else {
                setVerificationStatus('failure');
                setVerificationMessage(result.reason || 'Faces do not appear to match. Please try another photo.');
            }
        } catch (err) {
            setVerificationStatus('failure');
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during verification.';
            setError(errorMessage);
            setVerificationMessage(errorMessage);
        }
    }, [formData.liveness.selfie, formData.imageVerification.profilePicture]);

    const handleRetry = () => {
        setVerificationStatus('idle');
        setVerificationMessage('');
        setError(null);
        // Clear the failed photo to allow a new upload
        updateFormData({ imageVerification: { profilePicture: null } });
    };

    const getStatusComponent = () => {
        switch (verificationStatus) {
            case 'verifying':
                return (
                    <div className="flex flex-col items-center justify-center gap-2 text-[--color-primary] p-4">
                        <SpinnerIcon className="h-8 w-8" />
                        <span className="font-semibold text-lg">Verifying...</span>
                    </div>
                );
            case 'success':
                return (
                    <div className="w-full flex flex-col items-center justify-center gap-2 text-[--color-success] bg-[--color-success-bg] p-4 rounded-lg border border-green-200">
                        <CheckCircleIcon className="h-8 w-8" />
                        <span className="font-semibold text-lg">Verification successful.</span>
                    </div>
                );
            case 'failure':
                return (
                    <div className="w-full text-center text-[--color-danger] bg-[--color-danger-bg] p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-center gap-2">
                            <XCircleIcon className="h-8 w-8" />
                            <span className="font-bold text-lg">Verification Failed</span>
                        </div>
                        {verificationMessage && <p className="mt-2 text-sm">{verificationMessage}</p>}
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[--color-text-header] mb-2">Photo Verification</h2>
            <p className="text-[--color-text-body] mb-6">Upload a recent photo of yourself. We'll compare it with the selfie from the liveness check.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-center">
                    <h3 className="font-semibold text-[--color-text-body] mb-2">Liveness Selfie</h3>
                    {formData.liveness.selfie ? (
                        <img src={formData.liveness.selfie} alt="Selfie" className="rounded-lg shadow-md w-full mx-auto aspect-square object-cover transform -scale-x-100" />
                    ) : (
                        <div className="w-full aspect-square bg-[--color-surface-accent] rounded-lg flex items-center justify-center"><p>No selfie captured.</p></div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-[--color-text-body] mb-2">Your Photo</h3>
                    <label htmlFor="profile-pic-upload" className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-[--color-surface] hover:bg-[--color-surface-accent] border-[--color-border] hover:border-[--color-primary] transition-colors">
                        {formData.imageVerification.profilePicture ? (
                             <img src={formData.imageVerification.profilePicture} alt="Profile" className="rounded-lg w-full h-full object-cover" />
                        ) : (
                             <div className="text-center">
                               <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-[--color-text-muted]"><span className="font-semibold text-[--color-primary]">Click to upload</span></p>
                            </div>
                        )}
                        <input id="profile-pic-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" disabled={verificationStatus === 'verifying'} />
                    </label>
                </div>
            </div>

            <div className="mt-6 text-center space-y-4">
                 {error && <p className="text-[--color-danger]">{error}</p>}
                 {getStatusComponent()}
                 {verificationStatus === 'idle' && (
                     <button
                        onClick={handleVerification}
                        disabled={!formData.imageVerification.profilePicture}
                        className="w-full md:w-auto px-8 py-2.5 text-sm font-medium text-[--color-primary-text] bg-[--color-primary] rounded-lg hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Verify Photos
                    </button>
                 )}
                 {verificationStatus === 'failure' && (
                    <button
                        onClick={handleRetry}
                        className="w-full md:w-auto px-8 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Try Again
                    </button>
                 )}
            </div>
            
            <div className="flex justify-between pt-8">
                <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-medium text-[--color-text-body] bg-[--color-surface-accent] rounded-lg hover:bg-[--color-border] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring]">
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={verificationStatus !== 'success'}
                    className="px-6 py-2 text-sm font-medium text-[--color-primary-text] bg-[--color-primary] rounded-lg hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step3_5_ImageVerification;

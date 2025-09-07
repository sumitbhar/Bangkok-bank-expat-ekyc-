
import React, { useState, useCallback } from 'react';
import { FormData } from '../../types';
import { compareFaces } from '../../services/geminiService';
import { UploadIcon } from '../icons/UploadIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import Button from '../common/Button';
import Alert from '../common/Alert';

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
                setVerificationMessage('Verification successful. The faces appear to be a match.');
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
                    <Alert type="success" title="Verification Successful" message={verificationMessage} />
                );
            case 'failure':
                return (
                    <Alert type="error" title="Verification Failed" message={verificationMessage} />
                );
            default:
                return null;
        }
    };


    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Photo Verification</h2>
            <p className="text-[--color-text-body] mb-8">Upload a recent photo of yourself. We'll compare it with the selfie from the liveness check.</p>

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
                             <div className="text-center text-[--color-text-muted] hover:text-[--color-primary]">
                               <UploadIcon className="mx-auto h-12 w-12" />
                                <p className="mt-2 text-sm font-semibold">Click to upload</p>
                            </div>
                        )}
                        <input id="profile-pic-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" disabled={verificationStatus === 'verifying'} />
                    </label>
                </div>
            </div>

            <div className="mt-6 text-center space-y-4">
                 {error && !verificationMessage && <Alert type="error" title="Error" message={error} />}
                 {getStatusComponent()}
                 {verificationStatus === 'idle' && (
                     <Button
                        onClick={handleVerification}
                        disabled={!formData.imageVerification.profilePicture}
                        variant="primary"
                    >
                        Verify Photos
                    </Button>
                 )}
                 {verificationStatus === 'failure' && (
                    <Button
                        onClick={handleRetry}
                        variant="warning"
                    >
                        Try Again
                    </Button>
                 )}
            </div>
            
            <div className="flex justify-between pt-8">
                <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    disabled={verificationStatus !== 'success'}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Step3_5_ImageVerification;
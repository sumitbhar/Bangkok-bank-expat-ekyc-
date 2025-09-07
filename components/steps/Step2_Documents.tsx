
import React, { useState, useCallback } from 'react';
import { FormData } from '../../types';
import { extractPassportInfo } from '../../services/geminiService';
import { UploadIcon } from '../icons/UploadIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import Alert from '../common/Alert';

interface Props {
    nextStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
}

interface FileReadResult {
    base64: string;
    mimeType: string;
    dataUrl: string;
}

const readFile = (file: File): Promise<FileReadResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            const mimeType = file.type;
            resolve({ base64, mimeType, dataUrl });
        };
        reader.onerror = error => reject(error);
    });
};

const Step2Documents: React.FC<Props> = ({ nextStep, updateFormData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setFileName(file.name);

        try {
            const { base64, mimeType, dataUrl } = await readFile(file);
            const passportData = await extractPassportInfo(base64, mimeType);

            updateFormData({
                documents: { passport: dataUrl },
                personalInfo: {
                    fullName: passportData.fullName,
                    nationality: passportData.nationality,
                    dob: passportData.dateOfBirth,
                    passportNumber: passportData.passportNumber,
                    passportExpiry: passportData.expiryDate,
                }
            });
            
            nextStep();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setFileName(null);
        } finally {
            setIsLoading(false);
        }
    }, [nextStep, updateFormData]);

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Upload Passport</h2>
            <p className="text-[--color-text-body] mb-8">Please upload a clear, full-page image of your passport's photo page. Our AI will automatically extract the information.</p>
            
            <div className="mt-4">
                <label htmlFor="passport-upload" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-[--color-primary-light] hover:bg-opacity-70 border-[--color-primary] hover:border-blue-700 transition-colors">
                    {isLoading ? (
                         <div className="text-center">
                            <SpinnerIcon className="mx-auto h-12 w-12 text-[--color-primary]" />
                            <p className="mt-4 text-lg font-semibold text-[--color-primary]">Analyzing Document...</p>
                            <p className="text-sm text-[--color-text-muted]">This may take a moment. Please wait.</p>
                        </div>
                    ) : (
                        <div className="text-center text-[--color-primary]">
                           <UploadIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-base font-semibold">Click to upload or drag and drop</p>
                            <p className="text-xs">JPG, PNG (MAX. 5MB)</p>
                             {fileName && <p className="text-sm text-[--color-success] mt-2">{fileName}</p>}
                        </div>
                    )}
                    <input id="passport-upload" name="passport-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" disabled={isLoading} />
                </label>
            </div>

            {error && (
                <div className="mt-4">
                    <Alert type="error" title="Upload Failed" message={error} />
                </div>
            )}
        </div>
    );
};

export default Step2Documents;
import React, { useState, useCallback } from 'react';
import { FormData } from '../../types';
import { extractPassportInfo } from '../../services/geminiService';
import { UploadIcon } from '../icons/UploadIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';

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
            <h2 className="text-2xl font-bold text-[--color-text-header] mb-2">Upload Passport</h2>
            <p className="text-[--color-text-body] mb-6">Please upload a clear, full-page image of your passport's photo page. Our AI will automatically extract the information.</p>
            
            <div className="mt-4">
                <label htmlFor="passport-upload" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-[--color-surface] hover:bg-[--color-surface-accent] border-[--color-border] hover:border-[--color-primary] transition-colors">
                    {isLoading ? (
                         <div className="text-center">
                            <SpinnerIcon className="mx-auto h-12 w-12 text-[--color-primary]" />
                            <p className="mt-4 text-lg font-semibold text-[--color-primary]">Analyzing Document...</p>
                            <p className="text-sm text-[--color-text-muted]">This may take a moment. Please wait.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                           <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-[--color-text-muted]"><span className="font-semibold text-[--color-primary]">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-[--color-text-muted]">JPG, PNG (MAX. 5MB)</p>
                             {fileName && <p className="text-sm text-[--color-success] mt-2">{fileName}</p>}
                        </div>
                    )}
                    <input id="passport-upload" name="passport-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" disabled={isLoading} />
                </label>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-[--color-danger-bg] border border-[--color-danger] text-[--color-danger] rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Step2Documents;
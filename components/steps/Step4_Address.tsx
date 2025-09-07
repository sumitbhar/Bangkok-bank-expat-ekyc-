
import React, { useState, ChangeEvent } from 'react';
import { FormData } from '../../types';
import Button from '../common/Button';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

const Step4Address: React.FC<Props> = ({ nextStep, prevStep, formData, updateFormData }) => {
    const [localData, setLocalData] = useState(formData.address);
    const [errors, setErrors] = useState({
        bangkokAddress: '',
        homeCountryAddress: '',
    });

    const validate = (): boolean => {
        const newErrors = { bangkokAddress: '', homeCountryAddress: '' };
        let isValid = true;
        if (!localData.bangkokAddress.trim()) {
            newErrors.bangkokAddress = 'Bangkok address is required.';
            isValid = false;
        }
        if (!localData.homeCountryAddress.trim()) {
            newErrors.homeCountryAddress = 'Home country address is required.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };


    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            updateFormData({ address: localData });
            nextStep();
        }
    };
    
    const textAreaClassName = (hasError: boolean) =>
    `mt-1 block w-full px-3 py-2 bg-[--color-background-main] border ${
      hasError ? 'border-[--color-danger]' : 'border-[--color-border]'
    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring] focus:border-[--color-primary] transition-colors duration-150`;

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Address Information</h2>
            <p className="text-[--color-text-body] mb-8">Please provide your current address in Bangkok and your permanent address in your home country.</p>
            <form onSubmit={handleNext} className="space-y-6" noValidate>
                <div>
                    <label htmlFor="bangkokAddress" className="block text-sm font-medium text-[--color-text-body]">Current Address in Bangkok</label>
                    <textarea 
                        name="bangkokAddress" 
                        id="bangkokAddress" 
                        value={localData.bangkokAddress} 
                        onChange={handleChange} 
                        rows={4}
                        required 
                        className={textAreaClassName(!!errors.bangkokAddress)}
                        aria-invalid={!!errors.bangkokAddress}
                        aria-describedby="bangkokAddress-error"
                    />
                    {errors.bangkokAddress && <p id="bangkokAddress-error" className="mt-1 text-sm text-[--color-danger]">{errors.bangkokAddress}</p>}
                </div>
                <div>
                    <label htmlFor="homeCountryAddress" className="block text-sm font-medium text-[--color-text-body]">Permanent Address in Home Country</label>
                    <textarea 
                        name="homeCountryAddress" 
                        id="homeCountryAddress" 
                        value={localData.homeCountryAddress} 
                        onChange={handleChange} 
                        rows={4}
                        required 
                        className={textAreaClassName(!!errors.homeCountryAddress)}
                        aria-invalid={!!errors.homeCountryAddress}
                        aria-describedby="homeCountryAddress-error"
                    />
                    {errors.homeCountryAddress && <p id="homeCountryAddress-error" className="mt-1 text-sm text-[--color-danger]">{errors.homeCountryAddress}</p>}
                </div>
                
                <div className="flex justify-between pt-6">
                    <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                    <Button type="submit" variant="primary">Next</Button>
                </div>
            </form>
        </div>
    );
};

export default Step4Address;
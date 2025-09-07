
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FormData } from '../../types';
import DatePicker from '../DatePicker';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

const Step1PersonalInfo: React.FC<Props> = ({ nextStep, prevStep, formData, updateFormData }) => {
    const [localData, setLocalData] = useState(formData.personalInfo);
    const [errors, setErrors] = useState({
        fullName: '',
        nationality: '',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
    });

    useEffect(() => {
        setLocalData(formData.personalInfo);
    }, [formData.personalInfo]);

    const validate = (): boolean => {
        const newErrors = {
            fullName: '',
            nationality: '',
            dob: '',
            passportNumber: '',
            passportExpiry: '',
        };
        let isValid = true;

        if (!localData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required.';
            isValid = false;
        } else if (localData.fullName.trim().split(' ').length < 2) {
            newErrors.fullName = 'Please enter your full name as it appears on your passport.';
            isValid = false;
        }

        if (!localData.nationality.trim()) {
            newErrors.nationality = 'Nationality is required.';
            isValid = false;
        }

        if (!localData.dob) {
            newErrors.dob = 'Date of Birth is required.';
            isValid = false;
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            if (localData.dob >= todayStr) {
                newErrors.dob = 'Date of Birth must be in the past.';
                isValid = false;
            }
        }

        if (!localData.passportNumber.trim()) {
            newErrors.passportNumber = 'Passport Number is required.';
            isValid = false;
        } else if (!/^[A-Z0-9]{6,12}$/i.test(localData.passportNumber.trim())) {
             newErrors.passportNumber = 'Enter a valid passport number (6-12 alphanumeric characters).';
             isValid = false;
        }


        if (!localData.passportExpiry) {
            newErrors.passportExpiry = 'Passport Expiry Date is required.';
            isValid = false;
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            if (localData.passportExpiry <= todayStr) {
                newErrors.passportExpiry = 'Passport expiry date must be in the future.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: ''}));
        }
    };
    
     const handleDateChange = (name: 'dob' | 'passportExpiry', date: string) => {
        setLocalData(prev => ({ ...prev, [name]: date }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: ''}));
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            updateFormData({ personalInfo: localData });
            nextStep();
        }
    }

    const dobMaxDate = new Date();
    dobMaxDate.setDate(dobMaxDate.getDate()); 

    const expiryMinDate = new Date();
    expiryMinDate.setDate(expiryMinDate.getDate() + 1);
    
    const inputClassName = (hasError: boolean) =>
    `mt-1 block w-full px-3 py-2 bg-[--color-background-main] border ${
      hasError ? 'border-[--color-danger]' : 'border-[--color-border]'
    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring] focus:border-[--color-primary] transition-colors duration-150`;


    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Verify Personal Information</h2>
            <p className="text-[--color-text-body] mb-8">Please check the information extracted from your passport and correct any errors.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                 {/* Left Column: Passport Preview */}
                <div className="mb-6 lg:mb-0">
                    <h3 className="text-base font-semibold text-[--color-text-header] mb-2">Your Passport Document</h3>
                    {formData.documents.passport ? (
                        <img 
                            src={formData.documents.passport} 
                            alt="Passport Scan" 
                            className="rounded-xl shadow-md w-full border border-[--color-border]"
                        />
                    ) : (
                        <div className="w-full aspect-video bg-[--color-surface] rounded-xl flex items-center justify-center text-[--color-text-muted] border border-dashed border-[--color-border]">
                            <p>Passport image not available.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Form */}
                <form onSubmit={handleNext} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-[--color-text-body]">Full Name</label>
                        <input type="text" name="fullName" id="fullName" value={localData.fullName} onChange={handleChange} required className={inputClassName(!!errors.fullName)} aria-invalid={!!errors.fullName} aria-describedby="fullName-error"/>
                        {errors.fullName && <p id="fullName-error" className="mt-1 text-sm text-[--color-danger]">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label htmlFor="nationality" className="block text-sm font-medium text-[--color-text-body]">Nationality</label>
                        <input type="text" name="nationality" id="nationality" value={localData.nationality} onChange={handleChange} required className={inputClassName(!!errors.nationality)} aria-invalid={!!errors.nationality} aria-describedby="nationality-error"/>
                        {errors.nationality && <p id="nationality-error" className="mt-1 text-sm text-[--color-danger]">{errors.nationality}</p>}
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-[--color-text-body]">Date of Birth</label>
                        <DatePicker 
                            id="dob"
                            selectedDate={localData.dob}
                            onChange={(date) => handleDateChange('dob', date)}
                            maxDate={dobMaxDate}
                        />
                        {errors.dob && <p id="dob-error" className="mt-1 text-sm text-[--color-danger]">{errors.dob}</p>}
                    </div>
                    <div>
                        <label htmlFor="passportNumber" className="block text-sm font-medium text-[--color-text-body]">Passport Number</label>
                        <input type="text" name="passportNumber" id="passportNumber" value={localData.passportNumber} onChange={handleChange} required className={inputClassName(!!errors.passportNumber)} aria-invalid={!!errors.passportNumber} aria-describedby="passportNumber-error"/>
                        {errors.passportNumber && <p id="passportNumber-error" className="mt-1 text-sm text-[--color-danger]">{errors.passportNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="passportExpiry" className="block text-sm font-medium text-[--color-text-body]">Passport Expiry Date</label>
                         <DatePicker 
                            id="passportExpiry"
                            selectedDate={localData.passportExpiry}
                            onChange={(date) => handleDateChange('passportExpiry', date)}
                            minDate={expiryMinDate}
                        />
                        {errors.passportExpiry && <p id="passportExpiry-error" className="mt-1 text-sm text-[--color-danger]">{errors.passportExpiry}</p>}
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                        <Button type="submit" variant="primary">Next</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Step1PersonalInfo;
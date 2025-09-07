
import React, { useState, ChangeEvent } from 'react';
import { FormData } from '../../types';
import Button from '../common/Button';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

const Step_FinancialInfo: React.FC<Props> = ({ nextStep, prevStep, formData, updateFormData }) => {
    const [localData, setLocalData] = useState(formData.financialInfo || {
        employmentStatus: '',
        sourceOfFunds: '',
        monthlyTransactions: '',
    });
    const [errors, setErrors] = useState({
        employmentStatus: '',
        sourceOfFunds: '',
        monthlyTransactions: '',
    });

    const validate = (): boolean => {
        const newErrors = { employmentStatus: '', sourceOfFunds: '', monthlyTransactions: '' };
        let isValid = true;
        if (!localData.employmentStatus) {
            newErrors.employmentStatus = 'Employment status is required.';
            isValid = false;
        }
        if (!localData.sourceOfFunds) {
            newErrors.sourceOfFunds = 'Source of funds is required.';
            isValid = false;
        }
        if (!localData.monthlyTransactions) {
            newErrors.monthlyTransactions = 'Expected monthly transaction volume is required.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            updateFormData({ financialInfo: localData });
            nextStep();
        }
    };

    const selectClassName = (hasError: boolean) =>
    `mt-1 block w-full pl-3 pr-10 py-2 bg-[--color-background-main] border ${
      hasError ? 'border-[--color-danger]' : 'border-[--color-border]'
    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[--color-focus-ring] focus:border-[--color-primary] transition-colors duration-150`;

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Financial Information</h2>
            <p className="text-[--color-text-body] mb-8">Please provide some basic financial information for your account.</p>
            <form onSubmit={handleNext} className="space-y-6" noValidate>
                <div>
                    <label htmlFor="employmentStatus" className="block text-sm font-medium text-[--color-text-body]">Employment Status</label>
                    <select
                        name="employmentStatus"
                        id="employmentStatus"
                        value={localData.employmentStatus}
                        onChange={handleChange}
                        required
                        className={selectClassName(!!errors.employmentStatus)}
                        aria-invalid={!!errors.employmentStatus}
                        aria-describedby="employmentStatus-error"
                    >
                        <option value="" disabled>Select status...</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Student">Student</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Retired">Retired</option>
                    </select>
                    {errors.employmentStatus && <p id="employmentStatus-error" className="mt-1 text-sm text-[--color-danger]">{errors.employmentStatus}</p>}
                </div>

                <div>
                    <label htmlFor="sourceOfFunds" className="block text-sm font-medium text-[--color-text-body]">Primary Source of Funds</label>
                    <select
                        name="sourceOfFunds"
                        id="sourceOfFunds"
                        value={localData.sourceOfFunds}
                        onChange={handleChange}
                        required
                        className={selectClassName(!!errors.sourceOfFunds)}
                        aria-invalid={!!errors.sourceOfFunds}
                        aria-describedby="sourceOfFunds-error"
                    >
                        <option value="" disabled>Select source...</option>
                        <option value="Salary">Salary</option>
                        <option value="Business Income">Business Income</option>
                        <option value="Investments">Investments</option>
                        <option value="Savings">Savings</option>
                        <option value="Family Support">Family Support</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.sourceOfFunds && <p id="sourceOfFunds-error" className="mt-1 text-sm text-[--color-danger]">{errors.sourceOfFunds}</p>}
                </div>

                <div>
                    <label htmlFor="monthlyTransactions" className="block text-sm font-medium text-[--color-text-body]">Expected Monthly Transaction Volume (USD)</label>
                    <select
                        name="monthlyTransactions"
                        id="monthlyTransactions"
                        value={localData.monthlyTransactions}
                        onChange={handleChange}
                        required
                        className={selectClassName(!!errors.monthlyTransactions)}
                        aria-invalid={!!errors.monthlyTransactions}
                        aria-describedby="monthlyTransactions-error"
                    >
                        <option value="" disabled>Select range...</option>
                        <option value="< 1,000">Less than $1,000</option>
                        <option value="1,000 - 5,000">$1,000 - $5,000</option>
                        <option value="5,001 - 10,000">$5,001 - $10,000</option>
                        <option value="10,001 - 25,000">$10,001 - $25,000</option>
                        <option value="> 25,000">More than $25,000</option>
                    </select>
                    {errors.monthlyTransactions && <p id="monthlyTransactions-error" className="mt-1 text-sm text-[--color-danger]">{errors.monthlyTransactions}</p>}
                </div>

                <div className="flex justify-between pt-6">
                     <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                     <Button type="submit" variant="primary">Next</Button>
                </div>
            </form>
        </div>
    );
};

export default Step_FinancialInfo;
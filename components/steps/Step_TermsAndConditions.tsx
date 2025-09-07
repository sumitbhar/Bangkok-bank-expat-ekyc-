
import React, { useState } from 'react';
import Button from '../common/Button';

interface Props {
    nextStep: () => void;
    prevStep: () => void;
}

const Step_TermsAndConditions: React.FC<Props> = ({ nextStep, prevStep }) => {
    const [agreed, setAgreed] = useState(false);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (agreed) {
            nextStep();
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Terms & Conditions</h2>
            <p className="text-[--color-text-body] mb-8">Please read the following terms and conditions carefully before proceeding.</p>

            <div className="h-64 overflow-y-auto p-4 border border-[--color-border] rounded-lg bg-[--color-surface-accent] text-[--color-text-body] text-sm space-y-4">
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">1. Introduction</h4>
                    <p>Welcome to our eKYC service. By using this service, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this service.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">2. Definitions</h4>
                    <p>The term 'us' or 'we' refers to the owner of the service. The term 'you' refers to the user or viewer of our service. 'eKYC' means Electronic Know Your Customer.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">3. Use of the Service</h4>
                    <p>You agree to provide accurate, current, and complete information about yourself as prompted by the service's registration form. The information you provide will be used for identity verification purposes only. You are responsible for maintaining the confidentiality of any account information and are fully responsible for all activities that occur under your account.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">4. Data Privacy</h4>
                    <p>We are committed to protecting your privacy. The personal information collected is subject to our Privacy Policy, which is incorporated herein by reference. We will use your data to verify your identity and to comply with legal and regulatory requirements. We will not share your data with third parties except as required by law.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">5. Prohibited Conduct</h4>
                    <p>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You agree not to attempt any unauthorized access to any part of the service.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">6. Disclaimer of Warranties</h4>
                    <p>The service is provided on an "as is" and "as available" basis. We make no warranty that the service will meet your requirements or that it will be uninterrupted, timely, secure, or error-free.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">7. Limitation of Liability</h4>
                    <p>In no event shall we be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service.</p>
                </div>
                <div>
                    <h4 className="font-bold text-base text-[--color-text-header] mb-1">8. Governing Law</h4>
                    <p>These terms and conditions are governed by and construed in accordance with the laws of Thailand and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
                </div>
            </div>

            <form onSubmit={handleNext} noValidate>
                <div className="mt-6">
                    <label htmlFor="terms-agree" className="flex items-center cursor-pointer p-2 rounded-md hover:bg-[--color-surface-accent]">
                        <input
                            id="terms-agree"
                            name="terms-agree"
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-[--color-primary] focus:ring-[--color-focus-ring] focus:ring-offset-2"
                            required
                        />
                        <span className="ml-3 text-sm font-medium text-[--color-text-body]">I have read and agree to the Terms and Conditions.</span>
                    </label>
                </div>

                <div className="flex justify-between pt-8">
                     <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                     <Button type="submit" variant="primary" disabled={!agreed}>Next</Button>
                </div>
            </form>
        </div>
    );
};

export default Step_TermsAndConditions;
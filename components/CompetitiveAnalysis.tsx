import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { competitiveFeatures } from '../branding/competitiveData';

const CompetitiveAnalysis: React.FC = () => {
    
    const renderValue = (value: string) => {
        if (value.toLowerCase() === 'yes') return <CheckIcon className="h-6 w-6 text-[--color-success] mx-auto" />;
        if (value.toLowerCase().startsWith('yes')) {
             const detail = value.match(/\(([^)]+)\)/);
             return <div className="flex items-center justify-center gap-1.5">
                 <CheckIcon className="h-5 w-5 text-[--color-success]" />
                 <span>{detail ? detail[1] : ''}</span>
             </div>
        }
        if (value.toLowerCase() === 'no') return <XIcon className="h-5 w-5 text-[--color-danger] mx-auto" />;
        return value;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[--color-border] text-sm">
                <thead className="bg-[--color-surface]">
                    <tr>
                        <th scope="col" className="py-3.5 px-3 text-left font-semibold text-[--color-text-header]">Feature</th>
                        <th scope="col" className="py-3.5 px-3 text-center font-semibold text-[--color-primary-text] bg-[--color-primary] rounded-t-lg">Expat eKYC (This App)</th>
                        <th scope="col" className="py-3.5 px-3 text-center font-semibold text-[--color-text-header]">Traditional Banks</th>
                        <th scope="col" className="py-3.5 px-3 text-center font-semibold text-[--color-text-header]">Other FinTech Apps</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border] bg-[--color-background-main]">
                    {competitiveFeatures.map((item) => (
                        <tr key={item.feature}>
                            <td className="whitespace-nowrap py-4 px-3 font-medium text-[--color-text-body]">{item.feature}</td>
                            <td className="whitespace-nowrap py-4 px-3 text-center text-[--color-primary] font-bold">{renderValue(item.self)}</td>
                            <td className="whitespace-nowrap py-4 px-3 text-center text-[--color-text-muted]">{renderValue(item.traditional)}</td>
                            <td className="whitespace-nowrap py-4 px-3 text-center text-[--color-text-muted]">{renderValue(item.fintech)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompetitiveAnalysis;
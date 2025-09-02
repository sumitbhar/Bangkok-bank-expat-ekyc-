import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useBranding } from '../branding/BrandingContext';
import { themes } from '../branding/themes';
import { generateLogo } from '../services/geminiService';
import { TextSize } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { userManualContent } from '../branding/userManualContent';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import CompetitiveAnalysis from './CompetitiveAnalysis';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { pitchDeckContent } from '../branding/pitchDeckContent';
import { PresentationChartBarIcon } from './icons/PresentationChartBarIcon';
import { competitiveFeatures } from '../branding/competitiveData';

interface Props {
    onClose: () => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const BrandManager: React.FC<Props> = ({ onClose }) => {
    const { bankName, setBankName, logo, setLogo, theme, setTheme, textSize, setTextSize } = useBranding();
    const [logoPrompt, setLogoPrompt] = useState(`A modern, minimalist logo for a bank named "${bankName}"`);
    const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const triggerElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Save the element that triggered the modal
        triggerElementRef.current = document.activeElement as HTMLElement;

        const modalNode = modalRef.current;
        if (!modalNode) return;

        const focusableElements = modalNode.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus the first focusable element (the close button)
        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        modalNode.addEventListener('keydown', handleKeyDown);

        // Cleanup function
        return () => {
            modalNode.removeEventListener('keydown', handleKeyDown);
            // Restore focus to the trigger element
            triggerElementRef.current?.focus();
        };
    }, [onClose]);

    const handleLogoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setLogo(dataUrl);
        } catch (err) {
            setError('Could not read the selected file.');
        }
    }, [setLogo]);

    const handleGenerateLogos = async () => {
        setIsGenerating(true);
        setError(null);
        setGeneratedLogos([]);
        try {
            const images = await generateLogo(logoPrompt);
            setGeneratedLogos(images);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPitchDeck = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const footerHeight = 10;

        const slides = pitchDeckContent.split('# Slide');

        slides.forEach((slideContent, index) => {
            if (index === 0 || !slideContent.trim()) return;

            if (index > 1) {
                doc.addPage();
            }
            
            let y = 20;

            const lines = slideContent.trim().split('\n');
            const slideTitleLine = lines.shift() || 'Slide';
            const slideTitle = slideTitleLine.substring(slideTitleLine.indexOf(':') + 1).trim();
            
            // Slide Title
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(slideTitle, pageWidth / 2, y, { align: 'center' });
            y += 20;
            
            // Slide Content
            lines.forEach(line => {
                let text = line.trim();
                let x = margin;
                
                // Check if we need a new page
                if (y > pageHeight - margin - footerHeight) {
                     doc.addPage();
                     y = 20;
                }

                if (text.startsWith('[Image:')) {
                    const imgText = text.replace('[Image:', '').replace(']', '').trim();
                    const rectHeight = 60;
                    
                    doc.setFillColor(235, 237, 240); // Light gray background
                    doc.roundedRect(x, y, pageWidth - margin * 2, rectHeight, 3, 3, 'F');
                    
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'italic');
                    doc.setTextColor(120, 120, 120);
                    
                    const splitImgText = doc.splitTextToSize(imgText, pageWidth - margin * 4);
                    doc.text(splitImgText, pageWidth / 2, y + rectHeight / 2, { align: 'center', baseline: 'middle' });
                    
                    y += rectHeight + 10;
                    
                } else {
                    let fontSize = 11;
                    let isBold = false;
                    let isSubtitle = false;

                    if (text.startsWith('-- ')) {
                        text = `    • ${text.substring(3)}`;
                        x += 10;
                    } else if (text.startsWith('- ')) {
                        text = `• ${text.substring(2)}`;
                    } else if (text.startsWith('**') && text.endsWith('**')) {
                        isBold = true;
                        text = text.substring(2, text.length - 2);
                        fontSize = 12;
                    } else if (text.startsWith('*') && text.endsWith('*')) {
                        isSubtitle = true;
                        text = text.substring(1, text.length-1);
                        fontSize = 12;
                    }

                    doc.setFontSize(fontSize);
                    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                    doc.setTextColor(isSubtitle ? 100 : 0);

                    const splitText = doc.splitTextToSize(text, pageWidth - margin * 2 - x);
                    doc.text(splitText, x, y);
                    y += (splitText.length * 5) + 4;
                }
            });

             // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Slide ${index}`, pageWidth - margin, pageHeight - footerHeight, { align: 'right' });
        });

        doc.save('Expat_eKYC_Pitch_Deck.pdf');
    };

    const handleDownloadManual = () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 15;
        let y = margin; // Current y position on the page

        const lines = userManualContent.split('\n');

        lines.forEach(line => {
            // Check if we need a new page
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }

            let text = line.trim();
            let isBold = false;
            
            if (text.startsWith('# ')) {
                doc.setFontSize(22);
                isBold = true;
                text = text.substring(2);
                y += 5; // Add some space before main heading
            } else if (text.startsWith('## ')) {
                doc.setFontSize(18);
                 isBold = true;
                text = text.substring(3);
                 y += 4;
            } else if (text.startsWith('### ')) {
                doc.setFontSize(14);
                 isBold = true;
                text = text.substring(4);
                 y += 3;
            } else if (text.startsWith('- ')) {
                 doc.setFontSize(11);
                 text = `• ${text.substring(2)}`; // Use a bullet point
            } else if (text === '---') {
                doc.line(margin, y + 2, pageWidth - margin, y + 2); // Draw a horizontal line
                y += 6;
                return; // Skip rendering the '---' text
            }
            else {
                doc.setFontSize(11);
            }
            
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            
            // Handle text wrapping
            const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
            doc.text(splitText, margin, y);
            const textBlockHeight = (splitText.length * 7); // Estimate height of wrapped text
            y += textBlockHeight;
            y += 3; // Add a little space after each block
        });

        doc.save('eKYC_User_Manual.pdf');
    };

    const handleDownloadAnalysis = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Competitive Analysis: Expat eKYC', 14, 22);
        
        const head = [['Feature', 'Expat eKYC (This App)', 'Traditional Banks', 'Other FinTech Apps']];
        
        const pdfValue = (value: string) => {
            if (value.toLowerCase().startsWith('yes')) return `✔ ${value.replace(/yes/i, '').trim()}`.trim();
            if (value.toLowerCase() === 'no') return '✖';
            return value;
        };

        const body = competitiveFeatures.map(item => [
            item.feature,
            pdfValue(item.self),
            pdfValue(item.traditional),
            pdfValue(item.fintech)
        ]);

        autoTable(doc, {
            head: head,
            body: body,
            startY: 30,
            headStyles: {
                fillColor: [30, 64, 175] // --color-primary as RGB
            },
            columnStyles: {
                1: { fontStyle: 'bold' }
            }
        });

        doc.save('Competitive_Analysis.pdf');
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div ref={modalRef} className="bg-[--color-background-main] w-full max-w-2xl rounded-lg shadow-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-[--color-border] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[--color-text-header]">Brand Management</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[--color-surface-accent]">
                        <CloseIcon className="h-6 w-6 text-[--color-text-muted]" />
                    </button>
                </header>
                <main className="p-6 space-y-6 overflow-y-auto">
                    {/* Bank Name */}
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-[--color-text-body] mb-1">Bank Name</label>
                        <input
                            type="text"
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2 bg-[--color-background-main] border border-[--color-border] rounded-md shadow-sm focus:outline-none focus:ring-[--color-focus-ring] focus:border-[--color-primary]"
                        />
                    </div>

                    {/* Logo */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[--color-text-header]">Logo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                                <p className="text-sm font-medium text-[--color-text-body] mb-2">Current Logo</p>
                                <div className="h-24 w-24 flex items-center justify-center bg-[--color-surface] rounded-md border border-[--color-border]">
                                    {logo ? <img src={logo} alt="Current Logo" className="h-20 w-20 object-contain" /> : <span className="text-xs text-[--color-text-muted]">No Logo</span>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="logo-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[--color-border] rounded-md cursor-pointer hover:bg-[--color-surface]">
                                    <UploadIcon className="h-5 w-5" />
                                    Upload Logo
                                </label>
                                <input id="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                                <button onClick={() => setLogo(null)} className="mt-2 w-full text-sm text-[--color-danger]">Remove Logo</button>
                            </div>
                        </div>
                         {/* AI Logo Generator */}
                        <div className="p-4 bg-[--color-surface] rounded-lg border border-[--color-border]">
                             <h4 className="font-semibold flex items-center gap-2"><SparklesIcon className="h-5 w-5 text-yellow-500" /> AI Logo Maker</h4>
                             <p className="text-sm text-[--color-text-muted] my-2">Describe the logo you want, and our AI will generate options for you.</p>
                             <textarea
                                value={logoPrompt}
                                onChange={(e) => setLogoPrompt(e.target.value)}
                                rows={2}
                                className="w-full text-sm px-3 py-2 bg-[--color-background-main] border border-[--color-border] rounded-md shadow-sm focus:outline-none focus:ring-[--color-focus-ring] focus:border-[--color-primary]"
                             />
                             <button onClick={handleGenerateLogos} disabled={isGenerating} className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-[--color-primary-text] bg-[--color-primary] rounded-lg hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-focus-ring] disabled:bg-gray-400">
                                {isGenerating ? <><SpinnerIcon className="h-5 w-5" /> Generating...</> : 'Generate Logos'}
                             </button>
                             {error && <p className="text-sm text-[--color-danger] mt-2">{error}</p>}
                             {generatedLogos.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-center">Select a logo:</p>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {generatedLogos.map((imgSrc, i) => (
                                            <button key={i} onClick={() => setLogo(imgSrc)} className="p-1 border-2 border-transparent hover:border-[--color-primary] rounded-md focus:border-[--color-primary] focus:outline-none">
                                                <img src={imgSrc} alt={`Generated logo ${i+1}`} className="w-full h-full object-cover rounded-sm"/>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Color Theme */}
                    <div>
                        <h3 className="text-lg font-semibold text-[--color-text-header] mb-2">Color Theme</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {themes.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => setTheme(t)}
                                    className={`p-2 border rounded-md text-left text-sm ${t.name === theme.name ? 'border-[--color-primary] ring-2 ring-[--color-primary]' : 'border-[--color-border]'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span style={{ backgroundColor: t.colors['--color-primary'] }} className="h-5 w-5 rounded-full block border"></span>
                                        <span>{t.name.replace('Bangkok Bank ', '')}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                     {/* Text Size */}
                    <div>
                        <h3 className="text-lg font-semibold text-[--color-text-header] mb-2">Text Size</h3>
                        <div className="flex items-center gap-2 rounded-lg bg-[--color-surface] p-1">
                           {(['sm', 'base', 'lg'] as TextSize[]).map(size => (
                               <button 
                                key={size}
                                onClick={() => setTextSize(size)}
                                className={`w-full py-1 text-sm rounded-md capitalize ${textSize === size ? 'bg-[--color-primary] text-[--color-primary-text] shadow' : 'hover:bg-[--color-surface-accent]'}`}
                               >
                                {size === 'sm' ? 'Small' : size === 'base' ? 'Medium' : 'Large'}
                               </button>
                           ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold text-[--color-text-header] mb-2">Resources & Analysis</h3>
                        <div className="space-y-2">
                             <button
                                onClick={handleDownloadPitchDeck}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[--color-border] rounded-md cursor-pointer hover:bg-[--color-surface]"
                            >
                                <PresentationChartBarIcon className="h-5 w-5" />
                                Download Pitch Deck (PDF)
                            </button>
                            <button
                                onClick={handleDownloadManual}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[--color-border] rounded-md cursor-pointer hover:bg-[--color-surface]"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                Download User Manual (PDF)
                            </button>
                             <button
                                onClick={handleDownloadAnalysis}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[--color-border] rounded-md cursor-pointer hover:bg-[--color-surface]"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                Download Analysis (PDF)
                            </button>
                             <details className="group">
                                <summary className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[--color-border] rounded-md cursor-pointer hover:bg-[--color-surface] list-none">
                                     <div className="flex items-center justify-between w-full">
                                         <span className="flex items-center gap-2">
                                             <ChartBarIcon className="h-5 w-5" />
                                             View Competitive Edge
                                         </span>
                                         <svg className="h-5 w-5 transform transition-transform group-open:rotate-180" xmlns="http://www.w3.g/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                         </svg>
                                     </div>
                                </summary>
                                <div className="mt-2 p-4 bg-[--color-surface] border border-[--color-border] rounded-md">
                                    <CompetitiveAnalysis />
                                </div>
                            </details>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default BrandManager;
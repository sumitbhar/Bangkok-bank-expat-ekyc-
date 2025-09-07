
import React from 'react';
import { jsPDF } from 'jspdf';
import { FormData } from '../../types';
import { useBranding } from '../../branding/BrandingContext';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import Button from '../common/Button';

interface Props {
    logout: () => void;
    formData: FormData;
}

const StepSuccess: React.FC<Props> = ({ logout, formData }) => {
    const { bankName, logo } = useBranding();

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setProperties({
            title: `eKYC Application Summary - ${formData.personalInfo.fullName}`,
            subject: 'eKYC Application Summary',
            author: bankName,
        });

        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        // Header
        if (logo) {
            try {
               doc.addImage(logo, 'PNG', margin, y - 10, 20, 20);
            } catch (e) {
                console.error("Could not add logo to PDF:", e);
            }
        }
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(bankName, margin + 25, y);
        y += 5;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('eKYC Application Summary', margin + 25, y);
        y += 15;
        doc.setDrawColor(200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 15;

        const addSection = (title: string, data: [string, string][]) => {
            if (y > 250) { // Add new page if not enough space
                doc.addPage();
                y = margin;
            }
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, y);
            y += 8;
            
            data.forEach(([label, value]) => {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(label, margin, y);
                doc.setFont('helvetica', 'normal');
                const splitValue = doc.splitTextToSize(value || '-', pageWidth - margin * 2 - 60);
                doc.text(splitValue, margin + 60, y);
                y += (splitValue.length * 5) + 2;
            });
            y += 5;
        };

        const addImageSection = (title: string, imageDataUrl: string | null) => {
             if (y > 200) { // Need more space for images
                doc.addPage();
                y = margin;
            }
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, y);
            y += 8;

            if (imageDataUrl) {
                try {
                    const mimeType = imageDataUrl.substring(imageDataUrl.indexOf(":") + 1, imageDataUrl.indexOf(";"));
                    const format = mimeType.split('/')[1]?.toUpperCase();

                    const supportedFormats = ['JPEG', 'PNG', 'WEBP'];
                    if (!format || !supportedFormats.includes(format)) {
                        throw new Error(`Unsupported image format for PDF: ${format}`);
                    }

                    const imgProps = doc.getImageProperties(imageDataUrl);
                    const aspectRatio = imgProps.width / imgProps.height;
                    let imgWidth = 80;
                    let imgHeight = imgWidth / aspectRatio;
                    
                    if (imgHeight > 60) {
                        imgHeight = 60;
                        imgWidth = imgHeight * aspectRatio;
                    }

                    doc.addImage(imageDataUrl, format, margin, y, imgWidth, imgHeight);
                    y += imgHeight + 10;
                } catch(e) {
                    console.error("Error adding image to PDF:", e);
                    doc.setFont('helvetica', 'normal');
                    doc.text("Image could not be rendered.", margin, y);
                    y+= 7;
                }
            } else {
                doc.setFont('helvetica', 'normal');
                doc.text("Not provided.", margin, y);
                y += 7;
            }
            y += 5;
        };


        addSection("Personal Information", [
            ["Full Name", formData.personalInfo.fullName],
            ["Nationality", formData.personalInfo.nationality],
            ["Date of Birth", formData.personalInfo.dob],
            ["Passport Number", formData.personalInfo.passportNumber],
            ["Passport Expiry", formData.personalInfo.passportExpiry],
        ]);

        addSection("Address Information", [
            ["Bangkok Address", formData.address.bangkokAddress],
            ["Home Country Address", formData.address.homeCountryAddress],
        ]);

        if (formData.financialInfo) {
            addSection("Financial Information", [
                ["Employment Status", formData.financialInfo.employmentStatus],
                ["Source of Funds", formData.financialInfo.sourceOfFunds],
                ["Monthly Transactions", formData.financialInfo.monthlyTransactions],
            ]);
        }

        addImageSection("Passport Document", formData.documents.passport);
        addImageSection("Selfie", formData.liveness.selfie);
        addImageSection("Profile Photo", formData.imageVerification.profilePicture);

        doc.save(`eKYC_Summary_${formData.personalInfo.fullName.replace(/\s/g, '_')}.pdf`);
    };

    return (
        <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
            <CheckCircleIcon className="w-24 h-24 text-[--color-success] mb-4" />
            <h2 className="text-3xl font-bold text-[--color-text-header] tracking-tight mb-2">Application Submitted!</h2>
            <p className="text-[--color-text-body] mb-8 max-w-md">
                Thank you! Your eKYC application has been successfully submitted. You will receive an email confirmation shortly with your reference number.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                 <Button
                    variant="primary"
                    onClick={logout}
                    className="order-2 sm:order-1"
                >
                    Logout & Start New
                </Button>
                 <Button
                    variant="secondary"
                    onClick={handleDownload}
                    className="order-1 sm:order-2"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Download Summary
                </Button>
            </div>
        </div>
    );
};

export default StepSuccess;
export enum EKYCStep {
    PersonalInfo = 'PERSONAL_INFO',
    Documents = 'DOCUMENTS',
    Liveness = 'LIVENESS',
    ImageVerification = 'IMAGE_VERIFICATION',
    Address = 'ADDRESS',
    TermsAndConditions = 'TERMS_AND_CONDITIONS',
    Review = 'REVIEW',
    Success = 'SUCCESS',
}

export enum StepStatus {
    UPCOMING = 'UPCOMING',
    CURRENT = 'CURRENT',
    COMPLETED = 'COMPLETED',
}

export interface FormData {
    personalInfo: {
        fullName: string;
        nationality: string;
        dob: string;
        passportNumber: string;
        passportExpiry: string;
    };
    documents: {
        passport: string | null; // base64 string
    };
    liveness: {
        selfie: string | null; // base64 string
    };
    imageVerification: {
        profilePicture: string | null; // base64 string
    };
    address: {
        bangkokAddress: string;
        homeCountryAddress: string;
    };
}

export type TextSize = 'sm' | 'base' | 'lg';

export interface Theme {
  name: string;
  colors: {
    '--color-primary': string;
    '--color-primary-hover': string;
    '--color-primary-light': string;
    '--color-primary-text': string;
    '--color-secondary': string;
    '--color-secondary-hover': string;
    '--color-text-header': string;
    '--color-text-body': string;
    '--color-text-muted': string;
    '--color-background': string;
    '--color-background-main': string;
    '--color-surface': string;
    '--color-surface-accent': string;
    '--color-border': string;
    '--color-success': string;
    '--color-success-bg': string;
    '--color-danger': string;
    '--color-danger-bg': string;
    '--color-focus-ring': string;
  };
}

import { FormData, EKYCStep, User } from '../types';

const MOCK_LATENCY = () => 800 + Math.random() * 400; // ms

const simulateNetwork = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), MOCK_LATENCY());
    });
};

// --- AUTH ---
export const login = async (username: string): Promise<{ user: User }> => {
    const user = { username };
    // Use sessionStorage for session-only persistence
    sessionStorage.setItem('ekyc_user', JSON.stringify(user));
    return simulateNetwork({ user });
};

export const logout = async (): Promise<void> => {
    sessionStorage.removeItem('ekyc_user');
    return simulateNetwork(undefined);
};

export const getActiveUser = (): User | null => {
    try {
        const userStr = sessionStorage.getItem('ekyc_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};


// --- APPLICATION DATA ---
export const loadApplication = async (username: string): Promise<{ data: FormData; step: EKYCStep } | null> => {
    try {
        // Use localStorage for persistent data
        const savedState = localStorage.getItem(`ekyc_app_${username}`);
        if (savedState) {
            return simulateNetwork(JSON.parse(savedState));
        }
        return simulateNetwork(null);
    } catch (e) {
        return simulateNetwork(null);
    }
};

export const saveApplication = async (username: string, state: { data: FormData; step: EKYCStep }): Promise<void> => {
    try {
        localStorage.setItem(`ekyc_app_${username}`, JSON.stringify(state));
        // Simulate a quick save, no need for full latency
        return new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
        throw new Error("Could not save application progress.");
    }
};

export const submitApplication = async (username: string, formData: FormData): Promise<{ success: boolean; referenceId: string }> => {
    // In a real backend, this would save to a final database, run checks, send emails, etc.
    
    // Clear the in-progress application after successful submission
    localStorage.removeItem(`ekyc_app_${username}`);
    
    const referenceId = `BKB-EKYC-${Date.now()}`;
    return simulateNetwork({ success: true, referenceId });
};

export const clearApplicationData = (username: string): void => {
    localStorage.removeItem(`ekyc_app_${username}`);
}
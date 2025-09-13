export const userManualContent = `# eKYC Application User Manual

Welcome to the eKYC (Electronic Know Your Customer) application, a streamlined, AI-powered solution for modern banking onboarding. This guide will walk you through every feature of the application, from administrative brand setup to the final customer submission.

---

## 1. Brand Management (For Bank Administrators)

This panel allows you to fully customize the application's appearance to match your corporate identity in real-time, without needing any code changes.

### Accessing the Brand Manager
1.  Click the **Settings icon** (a cogwheel) located in the top-right corner of the application header.
2.  This will open the **Brand Management** modal overlay.

### Customization Options

#### Bank Name
- **How to use:** Type your bank's name into the "Bank Name" input field.
- **Result:** The application header and other brand mentions will update instantly.

#### Logo
You have two powerful options for setting your logo:

1.  **Upload Logo:**
    - Click the "Upload Logo" button.
    - Select an image file (e.g., PNG, JPG, SVG) from your computer.
    - The logo will immediately appear in the "Current Logo" preview and in the application header.
    - To remove it, simply click "Remove Logo".

2.  **AI Logo Maker (Powered by Gemini):**
    - For a new or refreshed look, describe the logo you envision in the text area. The default prompt is a great starting point. Be descriptive! For example: "A minimalist logo of a golden elephant for a premium bank".
    - Click **"Generate Logos"**. The AI will create four unique, high-quality logo options based on your prompt.
    - Click any of the four generated logos to instantly set it as your active brand logo.

#### Color Theme
- **How to use:** Browse through the curated list of professional color palettes.
- **Result:** Click on a theme name (e.g., Ocean Blue, Forest Green) to instantly apply its colors across the entire application, including buttons, backgrounds, and text, for a consistent brand experience. The currently selected theme is highlighted with a border.

#### Text Size
- **How to use:** To enhance accessibility and readability, select from "Small", "Medium", or "Large".
- **Result:** The application's base font size will adjust, making the content more comfortable to read for all users.

---

## 2. The eKYC Application Process (For End-Users)

This is the seamless, step-by-step journey your customers will take to open an account.

### Step 1: Upload Passport
1.  **Action:** The user is prompted to upload a clear, full-page image of their passport's photo page.
2.  **AI Processing:** Once uploaded, our AI scans the document and automatically extracts key information like Full Name, Nationality, Date of Birth, and Passport Number, eliminating manual entry.
3.  **Result:** Upon successful extraction, the application automatically proceeds to the next step.

### Step 2: Verify Personal Information
1.  **Action:** The user reviews the information extracted by the AI, which is now pre-filled into a form.
2.  **How:** They check each field for accuracy and can easily correct any errors. The passport image is shown alongside the form for easy comparison.
3.  **Validation:** The form includes validation to ensure data is logical (e.g., date of birth is in the past, passport is not expired).

### Step 3: Liveness Check
1.  **Action:** This critical security step verifies that the applicant is a real, live person.
2.  **How:** The application requests camera access. The user positions their face within the on-screen oval overlay and clicks "Capture Selfie".

### Step 4: Photo Verification
1.  **Action:** The user uploads a recent, clear photo of themselves (like a profile picture).
2.  **AI Comparison:** Our AI security model compares this new photo against the selfie from the Liveness Check to ensure they are the same person.
3.  **Result:** The screen provides instant feedback:
    - **Success:** The faces match, and the user can proceed.
    - **Failure:** The faces do not match. The user is prompted to try again with a different photo.

### Step 5: Address Information
1.  **Action:** The user provides their current address in Bangkok and their permanent residential address in their home country.

### Step 6: Financial Information
1.  **Action:** The user provides basic financial details required for account setup.
2.  **How:** They select their Employment Status, Primary Source of Funds, and Expected Monthly Transaction Volume from simple dropdown menus.

### Step 7: Terms & Conditions
1.  **Action:** The user must read and agree to the bank's terms and conditions.
2.  **How:** They scroll through the terms in the provided box and check the box to confirm their agreement.

### Step 8: Review & Submit
1.  **Action:** A comprehensive summary of all information and documents is displayed for a final check.
2.  **How:** The user can review every piece of data and every image. If a correction is needed, they can click the "Edit" button next to any section to jump directly back to that step.
3.  **Submission:** Once satisfied, the user clicks "Submit Application".

### Step 9: Application Success
- A confirmation screen appears, verifying that the application was submitted successfully.
- The user is provided with an option to **download a PDF summary** of their entire application for their records.

---

## 3. Security & Data Privacy

- **Session Timeout:** For security, user sessions automatically time out after 10 minutes of inactivity. A warning appears one minute prior, allowing the user to stay logged in.
- **Data Storage:** Application progress is saved securely in the browser's local storage, allowing users to resume an incomplete application later. All data is cleared upon successful submission or logout.

---

## 4. Troubleshooting

- **Camera Access Denied:** If the camera doesn't work, please check your browser's settings to ensure you have granted camera permissions for this site.
- **Passport Scan Failed:** Ensure the passport image is clear, well-lit, contains the full photo page, and has no significant glare.
- **Face Verification Failed:** Use a recent, clear, forward-facing photo with good lighting. Avoid wearing hats or sunglasses.

Thank you for using the eKYC Application!
`;
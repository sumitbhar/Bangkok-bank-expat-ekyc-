export const userManualContent = `# eKYC Application User Manual

Welcome to the eKYC (Electronic Know Your Customer) application. This guide will walk you through the entire process, from setting up your brand to completing a customer application.

## 1. Brand Management

Before your customers start the application process, you can customize the look and feel of the application to match your brand identity.

### Accessing the Brand Manager

1.  Click the **Settings icon** (cogwheel) in the top-right corner of the application header.
2.  This will open the **Brand Management** panel.

### Customization Options

#### Bank Name
- **To change the name:** Simply type the desired name into the "Bank Name" field. The application header will update in real-time.

#### Logo
You have two options for setting your logo:

1.  **Upload Logo:**
    - Click the "Upload Logo" button.
    - Select an image file from your computer (PNG, JPG, SVG, etc.).
    - The logo will appear in the "Current Logo" preview and in the application header.
    - To remove it, click "Remove Logo".

2.  **AI Logo Maker:**
    - Write a descriptive prompt in the text area under "AI Logo Maker". For example, "A friendly lion icon for a modern bank".
    - Click "Generate Logos". The AI will create four unique logo options.
    - Click on any of the generated logos to set it as your active logo.

#### Color Theme
- Choose from a predefined list of color palettes (e.g., Default, Ocean Blue, Forest Green).
- Click on a theme to instantly apply it to the entire application. The selected theme will have a blue border.

#### Text Size
- To improve accessibility, you can adjust the global text size.
- Select from "Small", "Medium", or "Large". The entire application's text will resize accordingly.

**Note:** All branding changes are automatically saved in your browser's local storage and will be remembered on your next visit.

---

## 2. The eKYC Application Process (For End-Users)

This is the step-by-step process your customers will follow.

### Step 1: Upload Passport
1.  **Action:** The user is prompted to upload a clear, full-page image of their passport's photo page.
2.  **How:** They can either click the upload area to select a file or drag and drop an image file onto it.
3.  **AI Processing:** Once uploaded, the AI automatically scans the document to extract key information (Full Name, Nationality, DOB, etc.).
4.  **Result:** Upon successful extraction, the user is automatically taken to the next step.

### Step 2: Verify Information
1.  **Action:** The user must review the information extracted by the AI in the previous step.
2.  **How:** All fields are pre-filled. The user should check each field for accuracy and correct any mistakes.
3.  **Validation:** The form includes validation to ensure data is in the correct format (e.g., valid dates, non-empty fields).
4.  **Navigation:** The user can click "Back" to re-upload their passport or "Next" to proceed once the information is confirmed to be correct.

### Step 3: Liveness Check
1.  **Action:** The user needs to perform a "liveness" check by taking a selfie to prove they are physically present.
2.  **How:** The application will request camera access. The user must position their face within the oval overlay on the screen.
3.  **Capture:** They click the "Capture Selfie" button to take a photo.

### Step 4: Photo Verification
1.  **Action:** The user uploads a recent photo of themselves.
2.  **AI Comparison:** This photo is then compared against the selfie taken during the liveness check to verify the user's identity.
3.  **Process:**
    - Upload a clear, recent photo.
    - Click "Verify Photos".
    - The AI will analyze both images.
4.  **Result:** The screen will display one of three statuses:
    - **Verifying...**: Analysis is in progress.
    - **Verification successful.**: The faces match. The user can proceed.
    - **Verification Failed.**: The faces do not match. The user can "Try Again" with a different photo.

### Step 5: Address
1.  **Action:** The user provides their current address in Bangkok and their permanent address in their home country.
2.  **How:** They fill in the two text areas provided.

### Step 6: Review & Submit
1.  **Action:** This is the final review step. The user sees a summary of all the information and documents they have provided throughout the process.
2.  **How:** They should carefully scroll through and check all details: Personal Information, Addresses, and all uploaded images (Passport, Selfie, Profile Photo).
3.  **Submission:** If everything is correct, they click "Submit Application". If not, they can use the "Back" button or the stepper on the left to navigate to the relevant section and make corrections.

### Step 7: Success
- Upon successful submission, a confirmation screen appears, thanking the user and indicating that the process is complete.
- From here, the user can choose to start a new application.

---

Thank you for using the eKYC Application!
`;
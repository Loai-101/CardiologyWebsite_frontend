# EmailJS Setup Guide for Automatic Email Sending

## Complete Setup Guide (10 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Log in to your EmailJS dashboard

### Step 2: Create Email Service
1. In your EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (since you're using Gmail)
4. Click **"Connect Account"** and sign in with `q9g8moh@gmail.com`
5. Authorize EmailJS to access your Gmail
6. Note down the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Fill in the template details:

**Template Name:** `Appointment Request Template`

**Subject:** `New Appointment Request - Dental Care Clinic`

**Content:**
```
Dear Dental Care Clinic Team,

A new appointment request has been submitted through your website.

PATIENT INFORMATION:
- Name: {{patient_name}}
- Email: {{patient_email}}
- Phone: {{patient_phone}}

APPOINTMENT DETAILS:
- Date: {{appointment_date_formatted}}
- Time: {{appointment_time}}
- Preferred Doctor: {{doctor}}
- Additional Message: {{message}}

Please contact the patient to confirm this appointment.

Best regards,
Dental Care Clinic Website
```

4. Click **"Save"**
5. Note down the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **"Account"** → **"General"**
2. Copy your **Public Key** (e.g., `user_abcdef123456`)

### Step 5: Update the Code
Open `src/pages/Appointment/Appointment.js` and replace these lines:

```javascript
// Find these lines (around line 76-78):
const serviceId = 'service_dental_clinic'; // Replace with your service ID
const templateId = 'template_appointment'; // Replace with your template ID
const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your public key

// Replace with your actual values:
const serviceId = 'service_abc123'; // Your actual service ID
const templateId = 'template_xyz789'; // Your actual template ID
const publicKey = 'user_abcdef123456'; // Your actual public key
```

### Step 6: Test the Setup
1. Save the file
2. Go to your website's appointment page
3. Fill out the form with test data
4. Click "Book Appointment"
5. Check your email (`q9g8moh@gmail.com`) for the appointment request

### Step 7: Deploy to Production
1. Commit your changes: `git add . && git commit -m "Add EmailJS configuration"`
2. Push to your repository: `git push origin main`
3. Your Vercel deployment will automatically update

## Troubleshooting

### If emails don't arrive:
1. Check your Gmail spam folder
2. Verify the service ID, template ID, and public key are correct
3. Check the browser console for any error messages
4. Make sure your Gmail account is properly connected in EmailJS

### If you get errors:
1. Ensure all required fields in the form are filled
2. Check that the template variables match exactly (case-sensitive)
3. Verify your EmailJS account is active and not suspended

## EmailJS Free Plan Limits
- 200 emails per month
- Perfect for a dental clinic's appointment requests
- Upgrade to paid plan if you need more emails

## Security Notes
- Your public key is safe to use in frontend code
- EmailJS handles the email sending securely
- No sensitive data is stored on EmailJS servers

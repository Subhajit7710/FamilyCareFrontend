# FamilyCare - Family Medication Tracking Application

A comprehensive family health management application built with React and Tailwind CSS. This application allows families to coordinate medication schedules, track health, and stay connected with each other's care.

## Features

### ✅ Implemented
- **Authentication System**
  - Sign in with email/password
  - Join family using invite code
  - Create new family groups with unique invite codes
  
- **Family Dashboard**
  - View all family members
  - See medication statistics (total meds, missed doses, missed reminders)
  - Track recent activity across family
  - Generate and share family invite codes
  
- **Patient Profiles**
  - View individual family member details
  - See all medications with status (Taken, Upcoming, Missed)
  - Mark medications as taken
  - Add new medications for any family member
  - View medication statistics
  
- **Medication Management**
  - Multi-step medication adding process
  - Drug search functionality
  - Dosage and schedule configuration
  - Medication status tracking
  
- **Responsive Design**
  - Mobile-friendly interface
  - Responsive layouts for all screen sizes
  - Touch-optimized interactions

## Technology Stack

- **React 18** - UI framework
- **React Router 7** - Navigation and routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript (ES6+)** - No TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔌 API Integration Guide

### Important Files to Configure

The main API configuration file is located at:
```
/src/app/services/api.js
```

### Step 1: Configure API Base URL

Open `/src/app/services/api.js` and find these lines at the top:

```javascript
// TODO: Replace with your actual API base URL
const API_BASE_URL = 'https://your-api-url.com/api';

// TODO: Replace with your actual API key if needed
const API_KEY = 'YOUR_API_KEY_HERE';
```

**Replace these with your actual values:**
```javascript
const API_BASE_URL = 'https://api.yourbackend.com/api';
const API_KEY = 'your-actual-api-key-here';
```

### Step 2: Configure API Key Headers (if needed)

In the `apiRequest` function, uncomment and configure your API key header:

```javascript
const headers = {
  'Content-Type': 'application/json',
  // TODO: Add your API key header if required
  'X-API-Key': API_KEY,  // Uncomment and adjust header name as needed
  // OR
  'Authorization': `Bearer ${API_KEY}`,  // If using Bearer token
  ...options.headers,
};
```

### Step 3: Connect API Endpoints

The file contains all API service functions organized by category:

#### Authentication Service (`authService`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Family Service (`familyService`)
- `POST /family/create` - Create new family group
- `POST /family/generate-invite` - Generate family invite code
- `POST /family/join` - Join family with invite code
- `GET /family/:familyId/members` - Get family members
- `GET /family/:familyId` - Get family details

#### Health Service (`healthService`)
- `GET /patients/:patientId/medications` - Get patient medications
- `POST /medications` - Add new medication
- `PUT /medications/:medicationId` - Update medication
- `POST /medications/:medicationId/mark-taken` - Mark medication as taken
- `GET /patients/:patientId/missed-medications` - Get missed medications
- `GET /family/:familyId/recent-activity` - Get recent family activity

#### Drug Service (`drugService`)
- `GET /drugs/search?q={query}` - Search for drug information

### Step 4: Replace Mock Data

Currently, the app uses mock data for demonstration. To connect to your real API:

1. **In `/src/app/context/AuthContext.jsx`:**
   ```javascript
   // Replace this:
   const response = await mockAuth.login(email, password);
   
   // With this:
   const response = await authService.login(email, password);
   ```

2. **In `/src/app/pages/Dashboard.jsx`:**
   ```javascript
   // Replace this:
   setFamilyMembers(mockData.familyMembers);
   
   // With this:
   const data = await familyService.getFamilyMembers(user.familyId);
   setFamilyMembers(data);
   ```

3. **In `/src/app/pages/PatientProfile.jsx`:**
   ```javascript
   // Replace this:
   const patientData = mockData.familyMembers.find(m => m.id === patientId);
   
   // With this:
   const patientData = await healthService.getPatientMedications(patientId);
   ```

### Expected API Response Formats

#### User Login Response
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "familyId": "string"
  },
  "token": "string"
}
```

#### Family Members Response
```json
[
  {
    "id": "string",
    "name": "string",
    "role": "string",
    "age": number,
    "status": "On track" | "Missed" | "Needs attention",
    "avatar": "string",
    "medsToday": number,
    "medicationsTaken": number,
    "medicationsTotal": number
  }
]
```

#### Medications Response
```json
[
  {
    "id": "string",
    "name": "string",
    "dosage": "string",
    "frequency": "string",
    "time": "string",
    "status": "Taken" | "Upcoming" | "Missed",
    "statusColor": "green" | "blue" | "red"
  }
]
```

## Project Structure

```
/src/app/
├── App.tsx                      # Main app component with router
├── routes.jsx                   # Route configuration
├── context/
│   └── AuthContext.jsx         # Authentication context and state
├── services/
│   └── api.js                  # ⭐ API integration (configure this file)
├── pages/
│   ├── Login.jsx               # Login/Join family page
│   ├── Dashboard.jsx           # Family dashboard
│   ├── PatientProfile.jsx      # Individual patient view
│   └── NotFound.jsx            # 404 page
└── components/
    ├── Sidebar.jsx             # Navigation sidebar
    └── AddMedicationModal.jsx  # Add medication dialog
```

## Key Features Implementation

### 1. Family Group Management
- Create family groups with unique IDs
- Generate invite codes for family members
- Join existing families using invite codes

### 2. Multi-User Medication Tracking
- View all family members from dashboard
- Click on any member to see their medications
- Track medication status (Taken, Upcoming, Missed)
- Add medications for any family member

### 3. Medication Alerts
- Visual indicators for missed medications
- Status badges for each medication
- Recent activity feed showing medication events

### 4. Responsive Design
- Desktop: Full sidebar navigation
- Mobile: Bottom navigation bar
- Touch-optimized interactions
- Responsive grid layouts

## Security Notes

⚠️ **Important Security Considerations:**

1. **Token Storage**: Currently using `localStorage` for auth tokens. For production, consider using httpOnly cookies.

2. **API Keys**: Never commit API keys to version control. Use environment variables:
   ```javascript
   const API_KEY = import.meta.env.VITE_API_KEY;
   ```

3. **HTTPS**: Always use HTTPS in production for API communication.

4. **Data Validation**: Add proper validation for all user inputs before sending to API.

## Mock Data (Remove in Production)

The application includes mock data for demonstration purposes in `/src/app/services/api.js`:
- `mockAuth` - Mock authentication
- `mockData` - Mock family and medication data

**Remove these after connecting to your real API.**

## Customization

### Styling
The application uses Tailwind CSS with a teal/cyan color scheme. To customize:
- Modify colors in component files (search for `teal-` and `cyan-`)
- Update `/src/styles/theme.css` for global styles

### Adding New Features
1. Create new page in `/src/app/pages/`
2. Add route in `/src/app/routes.jsx`
3. Add API endpoints in `/src/app/services/api.js`
4. Update navigation in `/src/app/components/Sidebar.jsx`

## Troubleshooting

### API Connection Issues
1. Check browser console for error messages
2. Verify API_BASE_URL is correct
3. Check CORS settings on your backend
4. Verify authentication token is being sent

### Mock Data Not Showing
- Mock data is intentionally provided for demonstration
- Replace mock data calls with real API calls (see Step 4 above)

## Support

For issues or questions:
1. Check the TODO comments in `/src/app/services/api.js`
2. Review console errors in browser developer tools
3. Verify API endpoint URLs match your backend

## License

This project is provided as-is for your use.

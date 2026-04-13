# FamilyCare - Family Medication Tracking App

A comprehensive family health management application for tracking medications, coordinating care, and staying connected with your loved ones' health.

![FamilyCare](https://img.shields.io/badge/React-18.3.1-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.12-cyan)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## ✨ Features

### Authentication & Family Management
- ✅ Sign in with email and password
- ✅ Create family groups with unique invite codes
- ✅ Join existing families using invite codes
- ✅ Secure authentication with JWT tokens

### Family Dashboard
- ✅ View all family members at a glance
- ✅ Real-time medication statistics
- ✅ Track missed doses and reminders
- ✅ Recent activity feed
- ✅ Generate and share invite codes

### Patient Profiles
- ✅ Click any family member to view their profile
- ✅ See all medications with current status
- ✅ Mark medications as taken
- ✅ Track missed medications with alerts
- ✅ Add new medications for any family member

### Medication Management
- ✅ Multi-step medication adding wizard
- ✅ Drug search functionality (ready for API integration)
- ✅ Configure dosage, frequency, and schedule
- ✅ Visual status indicators (Taken, Upcoming, Missed)
- ✅ One-click medication tracking

### Responsive Design
- ✅ Desktop: Full sidebar navigation
- ✅ Mobile: Optimized layouts and touch interactions
- ✅ Tablet: Responsive grid systems

## 🔌 API Integration

**IMPORTANT**: This app is ready for API integration but currently uses mock data for demonstration.

### To connect your backend API:

1. Open `/src/app/services/api.js`
2. Replace the placeholder API URL and key:
   ```javascript
   const API_BASE_URL = 'https://your-api-url.com/api';
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Follow the detailed instructions in `/API_INTEGRATION_GUIDE.md`

All API endpoints are marked with `TODO` comments showing exactly where to fill in your API details.

## 📁 Project Structure

```
/src/app/
├── App.tsx                     # Main app entry point
├── routes.jsx                  # React Router configuration
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── services/
│   └── api.js                 # ⭐ API integration (CONFIGURE THIS)
├── pages/
│   ├── Login.jsx              # Login & join family page
│   ├── Dashboard.jsx          # Main family dashboard
│   ├── PatientProfile.jsx     # Individual patient view
│   └── NotFound.jsx           # 404 error page
└── components/
    ├── Sidebar.jsx            # Navigation sidebar
    └── AddMedicationModal.jsx # Add medication wizard
```

## 🎯 Key Functionality

### For Family Members
1. **Create or Join a Family**
   - Create new family group → Get unique invite code
   - Share code with family members
   - Others join using the code

2. **View Family Health**
   - See all family members on dashboard
   - Check medication statuses at a glance
   - Monitor missed doses and alerts

3. **Manage Medications**
   - Click any family member's profile
   - View all their medications
   - Add new medications for them
   - Mark medications as taken
   - See missed medication alerts

### Data Flow
```
Login → Dashboard (View all family) → Click Member → Patient Profile
                                                      ↓
                                        View Medications / Add New / Mark Taken
```

## 🎨 Styling

Built with **Tailwind CSS 4.0** using a teal/cyan color scheme:
- Primary: `teal-600` (#0D9488)
- Accents: `cyan-50` to `cyan-100`
- Status colors: Green (taken), Blue (upcoming), Red (missed), Orange (needs attention)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Bottom nav, stacked layouts)
- **Tablet**: 768px - 1024px (Grid layouts)
- **Desktop**: > 1024px (Full sidebar, multi-column layouts)

## 🔐 Security Notes

⚠️ **Before production deployment:**

1. Replace mock authentication with real API
2. Use environment variables for API keys
3. Implement proper token refresh logic
4. Add input validation and sanitization
5. Enable HTTPS for all API calls
6. Consider httpOnly cookies instead of localStorage

## 🛠️ Technology Stack

- **React 18.3.1** - UI framework
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## 📚 Documentation

- **Full API Integration Guide**: See `/API_INTEGRATION_GUIDE.md`
- **API Service File**: `/src/app/services/api.js` (all endpoints documented)

## 🎓 How to Use

### Demo Mode (Current)
1. Run `npm run dev`
2. Use any email/password to sign in (mock auth)
3. Explore the demo data
4. Test all features

### Production Mode (After API Integration)
1. Configure API in `/src/app/services/api.js`
2. Replace mock calls with real API calls
3. Test authentication flow
4. Verify all CRUD operations
5. Deploy!

## 📝 Notes

- All TODO comments mark places where you need to add your API details
- Mock data is in `/src/app/services/api.js` under `mockData` export
- Remove mock data after connecting real API
- Images are imported using `figma:asset` scheme

## 🤝 Support

Need help connecting the API? Check:
1. `/API_INTEGRATION_GUIDE.md` - Complete integration guide
2. `/src/app/services/api.js` - All API endpoints with TODOs
3. Browser console - Error messages and logs

---

Built with ❤️ for better family health management

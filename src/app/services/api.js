// ============================================
// API CONFIGURATION - FILL IN YOUR API DETAILS
// ============================================

// TODO: Replace with your actual API base URL
const API_BASE_URL = 'http://localhost:3000';

// TODO: Replace with your actual API key if needed
const API_KEY = 'YOUR_API_KEY_HERE';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    // TODO: Add your API key header if required
    // 'X-API-Key': API_KEY,
    // 'Authorization': `Bearer ${API_KEY}`,
    ...options.headers,
  };

  // Add auth token if user is logged in
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Network or parsing error' };
      }
      throw new Error(errorData.error || errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  register: async (email, password, name) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile', {
      method: 'GET',
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },
};

// ============================================
// FAMILY SERVICE
// ============================================

export const familyService = {
  createFamily: async (familyName) => {
    return apiRequest('/families', {
      method: 'POST',
      body: JSON.stringify({ name: familyName }),
    });
  },

  generateInviteCode: async (familyId) => {
    return apiRequest(`/families/${familyId}/invite`, {
      method: 'POST',
    });
  },

  joinFamily: async (inviteCode) => {
    return apiRequest('/families/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  getFamilyMembers: async (familyId) => {
    return apiRequest(`/families/${familyId}/members`, {
      method: 'GET',
    });
  },

  getFamilyDetails: async (familyId) => {
    return apiRequest(`/families/${familyId}`, {
      method: 'GET',
    });
  },
};

// ============================================
// HEALTH SERVICE (Medications)
// ============================================

export const healthService = {
  getPatient: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}`, {
      method: 'GET',
    });
  },

  getFamilyPatients: async (familyId) => {
    return apiRequest(`/health/families/${familyId}/patients`, {
      method: 'GET',
    });
  },

  getPatientMedications: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}/medications`, {
      method: 'GET',
    });
  },

  getMedicationHistory: async (patientId, days = 1) => {
    return apiRequest(`/health/patients/${patientId}/history?days=${days}`, {
      method: 'GET',
    });
  },

  addMedication: async (patientId, medicationData) => {
    return apiRequest('/health/medications', {
      method: 'POST',
      body: JSON.stringify({
        patientId,
        ...medicationData,
      }),
    });
  },

  updateMedication: async (medicationId, updates) => {
    return apiRequest(`/health/medications/${medicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  markMedicationTaken: async (medicationId) => {
    return apiRequest(`/health/medications/${medicationId}/taken`, {
      method: 'POST',
      body: JSON.stringify({ takenAt: new Date().toISOString() }),
    });
  },

  getMissedMedications: async (patientId) => {
    return apiRequest(`/health/patients/${patientId}/missed-medications`, {
      method: 'GET',
    });
  },

  getRecentActivity: async (familyId) => {
    return apiRequest(`/health/families/${familyId}/recent-activity`, {
      method: 'GET',
    });
  },
};

// ============================================
// DRUG INFO SERVICE
// ============================================

export const drugService = {
  searchDrug: async (query) => {
    return apiRequest(`/health/drug-info/${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },
};

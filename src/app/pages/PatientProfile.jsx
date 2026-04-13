import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddMedicationModal from '../components/AddMedicationModal';
import { healthService } from '../services/api';

export default function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const memberName = location.state?.memberName;
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [activeTab, setActiveTab] = useState('medications');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await healthService.getPatient(patientId);
        if (response.success && response.patient) {
          const pt = response.patient;
          const actualName = (pt.name === 'Family Member' && memberName) ? memberName : pt.name;
          
          setPatient({
            ...pt,
            name: actualName,
            avatar: actualName ? actualName.substring(0, 2).toUpperCase() : '??',
            role: 'Family Member', // DB might not have role
            age: pt.age || 'N/A'
          });
          
          // Fetch logs to accurately check 'Taken' versus 'Missed'
          const historyResponse = await healthService.getMedicationHistory(patientId, 1);
          const logs = historyResponse.success ? historyResponse.history : [];
          
          const rawMeds = pt.Medications || [];
          
          const now = new Date();
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();

          const computedMeds = rawMeds.map(med => {
            const hasLogToday = logs.some(log => log.medication_id === med.id);
            if (hasLogToday) {
              return { ...med, status: 'taken', statusColor: 'green' };
            }
            
            let isMissed = false;
            if (med.schedule) {
              const [h, m] = med.schedule.split(':');
              const schedH = parseInt(h, 10);
              const schedM = parseInt(m, 10);
              if (schedH < currentHours || (schedH === currentHours && schedM < currentMinutes)) {
                isMissed = true;
              }
            }
            
            if (isMissed) {
              return { ...med, status: 'missed', statusColor: 'red' };
            }
            
            return { ...med, status: 'upcoming', statusColor: 'blue' };
          });
          
          setMedications(computedMeds);
        }
      } catch (err) {
        console.error("Failed to load patient", err);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleMarkTaken = async (medicationId) => {
    try {
      await healthService.markMedicationTaken(medicationId);
      
      // Update local state smoothly
      setMedications(medications.map(med => 
        med.id === medicationId 
          ? { ...med, status: 'taken', statusColor: 'green' }
          : med
      ));
    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }
  };

  const handleAddMedication = async (newMedication) => {
    try {
      const response = await healthService.addMedication(patient.id, newMedication);
      if (response && response.medication) {
        setMedications([...medications, response.medication]);
      } else {
        // Fallback for UI if success true but medication object not provided properly
        setMedications([...medications, { ...newMedication, id: 'temp-' + Date.now() }]);
      }
    } catch (err) {
      console.error('Failed to add medication', err);
    }
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  const normalizeStatus = (status) => (status || '').toLowerCase();

  const getStatusIcon = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'taken':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'upcoming':
      case 'active':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'taken':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'missed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    const s = normalizeStatus(status);
    if (s === 'active') return 'Upcoming';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const missedMedications = medications.filter(med => med.status === 'Missed' || med.status === 'missed');
  const upcomingMedications = medications.filter(med => med.status === 'Upcoming' || med.status === 'active' || med.status === 'upcoming');
  const takenMedications = medications.filter(med => med.status === 'Taken' || med.status === 'taken');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                {patient.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-semibold mb-1">{patient.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{patient.role} · Age {patient.age}</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Type 2 Diabetes
                  </span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    Hypertension
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('medications')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'medications'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Medications
                {activeTab === 'medications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'appointments'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Appointments
                {activeTab === 'appointments' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('healthlog')}
                className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === 'healthlog'
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Health Log
                {activeTab === 'healthlog' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'medications' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">All Medications</h2>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Medication</span>
                  </button>
                </div>

                {/* Missed Medications Alert */}
                {missedMedications.length > 0 && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-1">
                          {missedMedications.length} Missed Medication{missedMedications.length > 1 ? 's' : ''}
                        </h3>
                        <p className="text-sm text-red-700">
                          Please check with {patient.name} to ensure they take their medication.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medications List */}
                <div className="space-y-3">
                  {medications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {getStatusIcon(medication.status)}
                      </div>

                      {/* Medication Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{medication.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(medication.status)}`}>
                            {getStatusLabel(medication.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{medication.dosage}</span>
                          <span>·</span>
                          <span>{medication.frequency}</span>
                          <span>·</span>
                          <span>{medication.schedule || medication.time || '—'}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {(normalizeStatus(medication.status) === 'upcoming' || normalizeStatus(medication.status) === 'active') && (
                        <button
                          onClick={() => handleMarkTaken(medication.id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Mark Taken
                        </button>
                      )}

                      {normalizeStatus(medication.status) === 'missed' && (
                        <button
                          onClick={() => handleMarkTaken(medication.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Mark Taken
                        </button>
                      )}
                    </div>
                  ))}

                  {medications.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">No medications yet</h3>
                      <p className="text-gray-600 mb-4">
                        Add the first medication to get started
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add Medication
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="p-6">
                <p className="text-gray-600 text-center py-12">
                  Appointments feature coming soon...
                </p>
              </div>
            )}

            {activeTab === 'healthlog' && (
              <div className="p-6">
                <p className="text-gray-600 text-center py-12">
                  Health log feature coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Medications</div>
              <div className="text-3xl font-bold">{medications.length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Taken Today</div>
              <div className="text-3xl font-bold text-green-600">{takenMedications.length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Missed</div>
              <div className="text-3xl font-bold text-red-600">{missedMedications.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patientName={patient.name}
        onAdd={handleAddMedication}
      />

      {/* Mobile Back Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

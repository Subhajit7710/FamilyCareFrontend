import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Pill, AlertCircle, BellRing, Plus, Share2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import { familyService, healthService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, createFamily, joinFamily } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalMeds: 0,
    missedDoses: 0,
    missedReminders: 0,
  });
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  // New States for Onboarding
  const [joinMode, setJoinMode] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user || (!user.familyId && !user.family_id)) return;
      
      const familyId = user.familyId || user.family_id;

      try {
        // Fetch family members
        const membersData = await familyService.getFamilyMembers(familyId);
        
        // Fetch patient profiles directly to get meds data
        const patientsData = await healthService.getFamilyPatients(familyId);
        
        // Formulate familyMembers with meds stats
        const members = membersData.members || [];
        const patients = patientsData.patients || [];

        let totalMeds = 0;
        let missedDoses = 0;

        let takenCount = 0;

        const combinedMembers = await Promise.all(members.map(async member => {
          const patientProfile = patients.find(p => p.user_id === member.id) || { Medications: [] };
          const meds = patientProfile.Medications || [];
          
          let logs = [];
          if (patientProfile.id) {
            const hRes = await healthService.getMedicationHistory(patientProfile.id, 1);
            if (hRes.success) logs = hRes.history;
          }
          
          const medsToday = meds.length;
          let medicationsTaken = 0;
          let missed = 0;

          const now = new Date();
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();

          meds.forEach(med => {
            const hasLogToday = logs.some(log => log.medication_id === med.id);
            if (hasLogToday) {
              medicationsTaken++;
            } else {
              let isMissed = false;
              if (med.schedule) {
                const [h, m] = med.schedule.split(':');
                const schedH = parseInt(h, 10);
                const schedM = parseInt(m, 10);
                if (schedH < currentHours || (schedH === currentHours && schedM < currentMinutes)) {
                  isMissed = true;
                }
              }
              if (isMissed) missed++;
            }
          });

          totalMeds += medsToday;
          missedDoses += missed;
          takenCount += medicationsTaken;

          return {
            ...member,
            avatar: member.name ? member.name.substring(0, 2).toUpperCase() : '??',
            role: member.role || 'Member',
            status: missed > 0 ? 'Needs attention' : (medsToday === medicationsTaken ? 'On track' : 'Upcoming'),
            medsToday,
            medicationsTaken,
            medicationsTotal: medsToday
          };
        }));

        setFamilyMembers(combinedMembers);
        
        // Optional: Replace or fetch recent activity if backend supports it
        // For now, empty array
        setRecentActivity([]);

        setStats({
          totalMeds,
          missedDoses,
          missedReminders: missedDoses, // assuming 1:1 roughly
        });

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchData();
  }, [user]);

  const handleGenerateInvite = async () => {
    try {
      let code = '';
      const familyId = user?.familyId || user?.family_id;
      
      if (!familyId) {
        const result = await createFamily('My Family');
        code = result.inviteCode;
      } else {
        const result = await familyService.generateInviteCode(familyId);
        code = result.inviteCode;
      }
      
      setInviteCode(code);
      setShowInviteCode(true);
    } catch (error) {
      console.error('Failed to generate invite:', error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'On track':
        return 'bg-green-100 text-green-700';
      case 'Missed':
        return 'bg-orange-100 text-orange-700';
      case 'Needs attention':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'taken':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </div>
        );
      case 'missed':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-600 rounded-full" />
          </div>
        );
      case 'upcoming':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full" />
          </div>
        );
    }
  };

  const handleJoinFamily = async () => {
    setError('');
    setLoading(true);
    try {
      await joinFamily(joinCodeInput);
      // Wait for re-render as user context updates
    } catch (err) {
      setError(err.message || 'Failed to join family');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.familyId && !user?.family_id) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to FamilyCare</h2>
          <p className="text-gray-600 mb-8">You are not part of any family group yet. Would you like to create a new one or join an existing family?</p>
          
          {error && (
             <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
               {error}
             </div>
          )}

          {joinMode ? (
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="e.g. FAM-123"
                value={joinCodeInput} 
                onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono tracking-widest text-center"
              />
              <button disabled={loading || !joinCodeInput} onClick={handleJoinFamily} className="w-full bg-teal-600 text-white flex justify-center py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition">
                {loading ? 'Joining...' : 'Join Family'}
              </button>
              <button onClick={() => { setJoinMode(false); setError(''); }} className="w-full text-gray-500 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                Back
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={handleGenerateInvite} className="w-full bg-teal-600 text-white flex justify-center py-3 rounded-lg font-medium hover:bg-teal-700 shadow-sm transition">
                Create New Family
              </button>
              <button onClick={() => setJoinMode(true)} className="w-full border-2 border-teal-600 text-teal-700 bg-white py-3 rounded-lg font-medium hover:bg-teal-50 transition">
                Join Existing Family
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Family Dashboard</h1>
              <p className="text-gray-600">Manage your family's medications and health</p>
            </div>
            <button
              onClick={handleGenerateInvite}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Generate Invite Code</span>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Invite Code Modal */}
          {showInviteCode && (
            <div className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Family Invite Code Generated!</h3>
                  <p className="text-gray-600 text-sm">Share this code with family members to join</p>
                </div>
                <button
                  onClick={() => setShowInviteCode(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-teal-300 text-center">
                <div className="text-3xl font-bold font-mono tracking-widest text-teal-700">
                  {inviteCode}
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalMeds}</div>
                  <div className="text-sm text-gray-600">Meds for today</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.missedDoses}</div>
                  <div className="text-sm text-gray-600">Missed doses</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.missedReminders}</div>
                  <div className="text-sm text-gray-600">Missed reminders</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Family Members */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-lg mb-4">Family Members</h2>
                
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => navigate(`/patient/${member.id}`, { state: { memberName: member.name } })}
                      className="w-full text-left bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {member.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{member.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Pill className="w-4 h-4 text-gray-400" />
                            <span>{member.medsToday} meds today</span>
                          </div>
                          <div className="text-gray-400">
                            {member.medicationsTaken}/{member.medicationsTotal}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-teal-600">
            <Plus className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Pill className="w-6 h-6" />
            <span className="text-xs">Meds</span>
          </button>
        </div>
      </div>
    </div>
  );
}
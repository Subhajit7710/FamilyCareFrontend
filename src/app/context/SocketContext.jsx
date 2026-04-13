import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { initSocket } from '../services/socket';
import { toast } from 'sonner';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (user && token) {
      const s = initSocket(token);
      setSocket(s);

      s.on('connect', () => {
        console.log('Socket connected');
        if (user.familyId || user.family_id) {
          s.emit('join-family', user.familyId || user.family_id);
        }
      });

      s.on('medication-reminder', (data) => {
         toast(`Medication Alert: ${data.patientName} needs to take ${data.medicationName} now!`, {
           duration: 15000,
           icon: '🔔',
           style: { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }
         });
      });

      s.on('medication-taken', (data) => {
         toast.success(`${data.takenBy} marked ${data.medicationName} as Taken for ${data.patientName}.`, {
           duration: 5000,
           icon: '✅'
         });
      });

      return () => {
        s.disconnect();
      };
    }
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

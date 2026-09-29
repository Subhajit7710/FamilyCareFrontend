import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  // Generate calendar grid array
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarGrid = [...blanks, ...days];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <div className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-semibold dark:text-white">Calendar</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">View upcoming schedules and medication plans.</p>
        </div>

        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <ChevronLeft className="w-5 h-5 dark:text-gray-200" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition"
                >
                  Today
                </button>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <ChevronRight className="w-5 h-5 dark:text-gray-200" />
                </button>
              </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {dayNames.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px] divide-x divide-y divide-gray-100 dark:divide-gray-700/50">
              {/* Fill top border for the first week row using invisible top edge padding */}
              {calendarGrid.map((day, idx) => {
                const isToday = isCurrentMonth && day === today.getDate();
                
                return (
                  <div 
                    key={idx} 
                    className={`p-2 border-t border-gray-100 dark:border-gray-700/50 transition-colors ${
                      !day ? 'bg-gray-50/50 dark:bg-gray-800/20' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {day && (
                      <div className="flex flex-col h-full">
                        <div className={`
                          w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                          ${isToday ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300'}
                        `}>
                          {day}
                        </div>
                        {/* Future space for medication dots or items */}
                        <div className="flex-1 overflow-y-auto mt-1 space-y-1 scrollbar-hide">
                            {/* Example placeholder - logic could map real schedule here */}
                            {day % 5 === 0 && day > 0 && (
                                <div className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded truncate">
                                    General Checkup
                                </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

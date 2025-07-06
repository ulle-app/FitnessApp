import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const MyTimeLogs: React.FC = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/entry/logs?user_id=${user.phone}`)
        .then(r => r.json())
        .then(data => {
          setLogs(data);
          setLoading(false);
        });
    }
  }, [user]);

  const getMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.getFullYear() === year && logDate.getMonth() === month;
    });

    const calendar = [];
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayLogs = monthLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.getDate() === day;
      });
      calendar.push({ day, date, logs: dayLogs });
    }
    return calendar;
  };

  const getAttendanceStats = () => {
    const currentMonthLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      return logDate.getFullYear() === now.getFullYear() && 
             logDate.getMonth() === now.getMonth();
    });

    const presentDays = new Set();
    const totalHours = 0;
    
    currentMonthLogs.forEach(log => {
      const date = new Date(log.timestamp).toDateString();
      if (log.type === 'in') {
        presentDays.add(date);
      }
    });

    const workingDays = new Date().getDate(); // Days passed this month
    const attendanceRate = Math.round((presentDays.size / workingDays) * 100);

    return {
      presentDays: presentDays.size,
      workingDays,
      attendanceRate,
      totalHours
    };
  };

  const getDayStatus = (dayData: any) => {
    if (!dayData || !dayData.logs.length) return 'absent';
    const hasIn = dayData.logs.some((log: any) => log.type === 'in');
    const hasOut = dayData.logs.some((log: any) => log.type === 'out');
    if (hasIn && hasOut) return 'complete';
    if (hasIn) return 'partial';
    return 'absent';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'absent': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const stats = getAttendanceStats();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Please log in to view your attendance</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
            <div className="text-sm text-gray-500">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.presentDays}</div>
              <div className="text-blue-100">Present Days</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <div className="text-green-100">Attendance Rate</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.workingDays}</div>
              <div className="text-purple-100">Working Days</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-orange-100">Total Entries</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Monthly Calendar</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getMonthData().map((dayData, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-1 ${dayData ? 'cursor-pointer hover:bg-gray-50 rounded-lg' : ''}`}
                  >
                    {dayData && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {dayData.day}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(getDayStatus(dayData))}`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Complete Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Partial Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Absent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Entries</h2>
            <div className="space-y-3">
              {logs.slice(0, 10).map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">
                      {log.type === 'in' ? '🟢 Clock In' : '🔴 Clock Out'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            {logs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No attendance records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimeLogs; 
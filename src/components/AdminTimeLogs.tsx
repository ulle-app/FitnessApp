import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const AdminTimeLogs: React.FC = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [view, setView] = useState('today'); // today, week, month
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchLogs();
      fetchUsers();
    }
  }, [user, role, userId, date, view]);

  const fetchLogs = async () => {
    const params = [];
    if (role) params.push(`role=${role}`);
    if (userId) params.push(`user_id=${userId}`);
    if (date) params.push(`date=${date}`);
    const query = params.length ? '?' + params.join('&') : '';
    const res = await fetch(`/api/entry/logs${query}`);
    const data = await res.json();
    setLogs(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  const getTodayStatus = () => {
    const today = new Date().toDateString();
    const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
    
    const presentUsers = new Set();
    const absentUsers = new Set();
    
    users.forEach(u => {
      const userLogs = todayLogs.filter(log => log.user_id === u.phone);
      if (userLogs.some(log => log.type === 'in')) {
        presentUsers.add(u);
      } else {
        absentUsers.add(u);
      }
    });

    return { presentUsers: Array.from(presentUsers), absentUsers: Array.from(absentUsers) };
  };

  const getAttendanceStats = () => {
    const today = new Date().toDateString();
    const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
    
    const totalUsers = users.length;
    const presentUsers = new Set(todayLogs.filter(log => log.type === 'in').map(log => log.user_id)).size;
    const attendanceRate = totalUsers > 0 ? Math.round((presentUsers / totalUsers) * 100) : 0;

    return { totalUsers, presentUsers, attendanceRate };
  };

  const exportData = () => {
    const csvContent = [
      ['User', 'Role', 'Date', 'Time', 'Type', 'Location'].join(','),
      ...logs.map(log => [
        log.user_id,
        log.role,
        new Date(log.timestamp).toLocaleDateString(),
        new Date(log.timestamp).toLocaleTimeString(),
        log.type,
        log.location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Admin access only</h2>
      </div>
    );
  }

  const stats = getAttendanceStats();
  const todayStatus = getTodayStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
            <button
              onClick={exportData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Export CSV
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.presentUsers}</div>
              <div className="text-green-100">Present Today</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.totalUsers - stats.presentUsers}</div>
              <div className="text-red-100">Absent Today</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <div className="text-blue-100">Attendance Rate</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-purple-100">Total Entries</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="expert">Expert</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="fitness_trainer">Fitness Trainer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    <option value="">All Users</option>
                    {users.map(u => (
                      <option key={u.phone} value={u.phone}>{u.username}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Present Today */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Present Today</h2>
              <div className="space-y-2">
                {todayStatus.presentUsers.map((u: any) => (
                  <div key={u.phone} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-800">{u.username}</div>
                      <div className="text-sm text-gray-500">{u.role}</div>
                    </div>
                  </div>
                ))}
                {todayStatus.presentUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No one present today</div>
                )}
              </div>
            </div>
          </div>

          {/* Time Logs Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {users.find(u => u.phone === log.user_id)?.username || log.user_id}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            log.type === 'in' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.type === 'in' ? '🟢 In' : '🔴 Out'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {log.location || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {logs.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No time logs found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeLogs; 
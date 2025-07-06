import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import AdminTimeLogs from './AdminTimeLogs';
import QRCode from 'qrcode.react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const sections = [
  { key: 'users', label: 'Users' },
  { key: 'payments', label: 'Payments' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'time_logs', label: 'Time Logs' },
];

const countryCodes = [
  { code: '+91', label: 'India' },
  // Add more as needed
];

function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      <span className="font-semibold text-lg">{message}</span>
    </div>
  );
}

// Utility to normalize phone numbers (strip +91 and non-digits)
function normalizePhone(phone: string) {
  return phone.replace(/^\+91/, '').replace(/\D/g, '');
}

const AdminDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ phone: '', username: '', email: '', password: '', specialty: '' });
  const [userForm, setUserForm] = useState({ phone: '', username: '', email: '', password: '', role: 'user', specialty: '' });
  const [message, setMessage] = useState('');
  const [pw, setPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [section, setSection] = useState('users');
  const [payments, setPayments] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [toast, setToast] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [validation, setValidation] = useState({ phone: '', username: '', email: '', password: '' });
  const entryUrl = `${window.location.origin}/entry`;
  const [copied, setCopied] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showDelete, setShowDelete] = useState<{ user: any } | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [showChangePw, setShowChangePw] = useState(false);
  const [originalPhone, setOriginalPhone] = useState<string | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [trainers, setTrainers] = useState<any[]>([]);

  const currentUser = user ? user : null;

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      setUsers(data);
      setTrainers(data.filter((u: any) => u.role === 'trainer'));
    });
  }, []);

  useEffect(() => {
    if (section === 'payments') fetch('/api/admin/payments').then(r => r.json()).then(setPayments);
    if (section === 'facilities') fetch('/api/admin/facilities').then(r => r.json()).then(setFacilities);
  }, [section]);

  React.useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleCreateExpert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/admin/create-expert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Expert ${form.username} created!`);
      setForm({ phone: '', username: '', email: '', password: '', specialty: '' });
      fetch('/api/admin/users').then(r => r.json()).then(setUsers);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(data.error || 'Error creating expert');
    }
  };

  const validateForm = () => {
    let valid = true;
    const v = { phone: '', username: '', email: '', password: '' };
    // Phone: must be 10 digits, no letters
    if (!/^\d{10}$/.test(userForm.phone)) {
      v.phone = 'Phone must be exactly 10 digits.';
      valid = false;
    }
    // Username: allow numbers now
    // Email: basic check
    if (!/^\S+@\S+\.\S+$/.test(userForm.email)) {
      v.email = 'Invalid email address.';
      valid = false;
    }
    // Password: at least 6 chars
    if (userForm.password.length < 6) {
      v.password = 'Password must be at least 6 characters.';
      valid = false;
    }
    setValidation(v);
    return valid;
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('[DEBUG] handleCreateUser called with:', userForm, countryCode);
    if (!validateForm()) {
      console.log('[DEBUG] validateForm failed');
      return;
    }
    setMessage('');
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userForm, role: userForm.role.toLowerCase(), phone: countryCode + userForm.phone })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('User created!');
      setToast('User created!');
      setUserForm({ phone: '', username: '', email: '', password: '', role: 'user', specialty: '' });
      setValidation({ phone: '', username: '', email: '', password: '' });
      fetch('/api/admin/users').then(r => r.json()).then(setUsers);
      setShowNewUserModal(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(data.error || 'Error creating user');
      setToast(data.error || 'Error creating user');
    }
  };

  const handleSendOtp = async () => {
    if (!currentUser) return;
    await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: currentUser.phone })
    });
    setOtpSent(true);
    setToast('OTP sent to your registered phone!');
  };

  const handleChangePw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwMsg('');
    const res = await fetch('/api/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: currentUser?.phone, password: pw, otp })
    });
    const data = await res.json();
    if (data.success) {
      setPwMsg('Password changed!');
      setToast('Password changed successfully!');
      setPw('');
      setOtp('');
      setOtpSent(false);
    } else {
      setPwMsg(data.error || 'Error changing password');
      setToast(data.error || 'Error changing password');
    }
  };

  const handleEditUser = (user: any) => {
    setEditUser(user);
    setEditForm({ ...user });
    setOriginalPhone(user.phone);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation as needed
    const res = await fetch('/api/admin/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, oldPhone: originalPhone })
    });
    const data = await res.json();
    if (data.success) {
      setToast(`User ${editForm.username} updated successfully!`);
      setEditUser(null);
      setOriginalPhone(null);
      fetch('/api/admin/users').then(r => r.json()).then(setUsers);
    } else {
      setToast(data.error || 'Error updating user');
    }
  };

  const handleDeleteUser = async (user: any) => {
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone })
      });
      const data = await res.json();
      if (data.success) {
        setToast(`User ${user.username} deleted successfully!`);
        setShowDelete(null);
        fetch('/api/admin/users').then(r => r.json()).then(setUsers);
      } else {
        setToast(data.error || 'Error deleting user');
        console.error('Delete error:', data.error);
      }
    } catch (err) {
      setToast('Network error while deleting user');
      console.error('Delete error:', err);
    }
    setDeleteLoading(false);
  };

  const handleAssignTrainer = async (userPhone: string, trainerPhone: string) => {
    await fetch('/api/admin/assign-trainer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPhone, trainerPhone })
    });
    // Refresh users
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      setUsers(data);
      setTrainers(data.filter((u: any) => u.role === 'trainer'));
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 shadow-lg sticky top-0 h-screen z-10 hidden md:flex">
        <div className="text-2xl font-extrabold mb-10 tracking-tight text-blue-700 flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4m16 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" /></svg>
          Admin Panel
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {sections.map(s => (
            <button key={s.key} className={`text-left py-3 px-4 rounded-lg font-semibold transition text-lg ${section === s.key ? 'bg-blue-100 text-blue-700 shadow' : 'hover:bg-gray-100 text-gray-700'}`} onClick={() => setSection(s.key)}>{s.label}</button>
          ))}
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-400">Heal Fitness Zone Admin</div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
          onClick={() => navigate('/admin/workouts')}
        >
          Manage Workouts
        </button>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-between px-8 h-20 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-700">{sections.find(s => s.key === section)?.label || 'Admin Dashboard'}</h1>
          <div className="flex items-center gap-4">
            {/* Profile avatar, logout, and change password */}
            {currentUser && (
              <>
                <div className="w-10 h-10 rounded-full border-2 border-green-400 bg-white flex items-center justify-center overflow-hidden shadow">
                  {currentUser.photo ? (
                    <img src={currentUser.photo} alt="Profile" className="object-cover w-full h-full" />
                  ) : currentUser.defaultAvatar ? (
                    <span className="text-2xl select-none">{currentUser.defaultAvatar}</span>
                  ) : (
                    <span className="text-gray-400 text-2xl flex items-center justify-center w-full h-full">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
                    </span>
                  )}
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setShowChangePw(true)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-2 rounded transition border border-blue-100 bg-blue-50 hover:bg-blue-100"
                    title="Change Password"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    <span className="hidden md:inline">Change Password</span>
                  </button>
                )}
                <button
                  onClick={() => { logout(); navigate('/', { replace: true }); }}
                  className="text-gray-700 hover:text-green-600 font-medium text-sm ml-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        {/* Main Content */}
        <main className="flex-1 flex justify-center items-start p-10 bg-gray-50 min-h-[calc(100vh-5rem)]">
          <div className="w-full max-w-5xl space-y-10">
            {section === 'users' && (
              <div className="w-full flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-700">All Users</h2>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-max w-full text-left">
                      <thead>
                        <tr className="bg-blue-50 text-blue-700">
                          <th className="py-3 px-3 font-semibold">Photo</th>
                          <th className="py-3 px-3 rounded-l-lg font-semibold">Phone</th>
                          <th className="py-3 px-3 font-semibold">Username</th>
                          <th className="py-3 px-3 font-semibold">Email</th>
                          <th className="py-3 px-3 font-semibold">Role</th>
                          <th className="py-3 px-3 font-semibold">Trainer</th>
                          <th className="py-3 px-3 rounded-r-lg font-semibold">Specialty</th>
                          <th className="py-3 px-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-blue-50 transition">
                            <td className="py-3 px-3">
                              <img
                                src={u.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.username || 'User') + '&background=0D8ABC&color=fff'}
                                alt={u.username || 'User'}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                              />
                            </td>
                            <td className="py-3 px-3 font-mono whitespace-nowrap">{`+91${normalizePhone(u.phone)}`}</td>
                            <td className="py-3 px-3 whitespace-nowrap">{u.username}</td>
                            <td className="py-3 px-3 whitespace-nowrap">{u.email}</td>
                            <td className="py-3 px-3 capitalize whitespace-nowrap">{u.role}</td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              {u.role === 'admin' || u.role === 'trainer' ? (
                                <span className="text-gray-400">-</span>
                              ) : (
                                <select
                                  className="border border-gray-300 rounded-lg p-2"
                                  value={normalizePhone(u.assigned_trainer || '')}
                                  onChange={e => handleAssignTrainer(u.phone, e.target.value)}
                                >
                                  <option value="">None</option>
                                  {trainers.map((t: any) => (
                                    <option key={t.phone} value={normalizePhone(t.phone)}>{t.username}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">{u.specialty || '-'}</td>
                            <td className="py-3 px-3 flex justify-end gap-2">
                              {u.role !== 'admin' && (
                                <>
                                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-bold text-xs" onClick={() => handleEditUser(u)}>Edit</button>
                                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold text-xs" onClick={() => setShowDelete({ user: u })}>Delete</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {section === 'payments' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Payments</h2>
                <table className="w-full mb-6">
                  <thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th><th>Date</th><th>Method</th></tr></thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i}><td>{p.id}</td><td>{p.user}</td><td>{p.amount}</td><td>{p.status}</td><td>{p.date}</td><td>{p.method}</td></tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {section === 'facilities' && facilities && (
              <>
                <h2 className="text-2xl font-bold mb-4">Facilities & Housekeeping</h2>
                <div className="mb-4">Housekeeping: <span className="font-semibold">{facilities.housekeeping}</span></div>
                <div className="mb-4">Washrooms: <span className="font-semibold">{facilities.washrooms}</span></div>
                <div className="mb-4">Equipment: <span className="font-semibold">{facilities.equipment}</span></div>
                <div className="mb-4">Last Checked: <span className="font-semibold">{facilities.lastChecked}</span></div>
                <h3 className="text-lg font-semibold mb-2">Areas</h3>
                <table className="w-full mb-6">
                  <thead><tr><th>Area</th><th>Status</th><th>Last Cleaned</th></tr></thead>
                  <tbody>
                    {facilities.issues.map((a: any, i: number) => (
                      <tr key={i}><td>{a.area}</td><td>{a.status}</td><td>{a.lastCleaned}</td></tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {section === 'analytics' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                <div className="mb-4">Active Users: <span className="font-semibold">{users.filter(u => u.role === 'user').length}</span></div>
                <div className="mb-4">Active Experts: <span className="font-semibold">{users.filter(u => u.role === 'expert').length}</span></div>
                <div className="mb-4">Total Payments: <span className="font-semibold">{payments.reduce((a, p) => a + (p.amount || 0), 0)}</span></div>
                <div className="mb-4">Facility Status: <span className="font-semibold">{facilities ? facilities.housekeeping : 'N/A'}</span></div>
              </>
            )}
            {section === 'time_logs' && (
              <div className="max-w-5xl mx-auto">
                <AdminTimeLogs />
              </div>
            )}
            {editUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">Edit User</h3>
                  <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-4">
                    <input
                      className="border border-gray-300 rounded-lg p-3"
                      name="phone"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={handleEditFormChange}
                      required
                    />
                    <input
                      className="border border-gray-300 rounded-lg p-3"
                      name="username"
                      placeholder="Username"
                      value={editForm.username}
                      onChange={handleEditFormChange}
                      required
                    />
                    <input
                      className="border border-gray-300 rounded-lg p-3"
                      name="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      required
                    />
                    <select
                      className="border border-gray-300 rounded-lg p-3"
                      name="role"
                      value={editForm.role}
                      onChange={handleEditFormChange}
                    >
                      <option value="user">User</option>
                      <option value="expert">Expert</option>
                      <option value="trainer">Trainer</option>
                      <option value="frontdesk">Front Desk Manager</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="admin">Admin</option>
                      <option value="client">Client</option>
                      <option value="customer">Customer</option>
                    </select>
                    <input
                      className="border border-gray-300 rounded-lg p-3"
                      name="specialty"
                      placeholder="Specialty"
                      value={editForm.specialty}
                      onChange={handleEditFormChange}
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow transition" type="submit">Save Changes</button>
                    <button type="button" className="mt-2 text-gray-500 hover:text-gray-700 font-semibold" onClick={() => { setEditUser(null); setOriginalPhone(null); }}>Cancel</button>
                  </form>
                </div>
              </div>
            )}
            {showDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
                  <h3 className="text-xl font-bold mb-4">Delete User</h3>
                  <div className="mb-6">Are you sure you want to delete <b>{showDelete.user.username}</b>?</div>
                  <div className="flex gap-4 justify-end">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow transition disabled:opacity-60"
                      onClick={() => handleDeleteUser(showDelete.user)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-bold shadow transition"
                      onClick={() => setShowDelete(null)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="fixed bottom-10 right-10 z-40">
              <button
                className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl text-white text-3xl transition-all focus:outline-none"
                title="Add New User"
                onClick={() => setShowNewUserModal(true)}
                aria-label="Add New User"
              >
                +
              </button>
            </div>
          </div>
        </main>
        {/* Change Password Modal */}
        {showChangePw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Change Admin Password</h3>
              <form onSubmit={handleChangePw} className="flex flex-col gap-4">
                <input className="border border-gray-300 rounded-lg p-3" placeholder="New Password" value={pw} onChange={e => setPw(e.target.value)} required />
                <div className="flex gap-2 items-center">
                  <input className="border border-gray-300 rounded-lg p-3 flex-1" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
                  <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow transition" onClick={handleSendOtp} disabled={otpSent}>Send OTP</button>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow transition" type="submit">Change Password</button>
              </form>
              {pwMsg && <div className="mt-4 text-green-700 font-semibold">{pwMsg}</div>}
              <button className="mt-6 text-gray-500 hover:text-gray-700 font-semibold" onClick={() => setShowChangePw(false)}>Close</button>
            </div>
          </div>
        )}
        {showNewUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-auto bg-[#18181b] rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
              <button onClick={() => setShowNewUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl focus:outline-none" aria-label="Close">×</button>
              <img src="/logo_dark.png" alt="Heal Fitness Zone Logo" className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-green-400 bg-white dark:bg-gray-900" />
              <div className="text-3xl font-extrabold text-white mb-8 tracking-tight text-center">Add New User</div>
              <form className="w-full flex flex-col gap-4" onSubmit={handleCreateUser}>
                <div className="w-full mb-4">
                  <div className="flex items-center border-b border-gray-600">
                    <span className="text-white text-lg font-semibold mr-2">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={userForm.phone}
                      onChange={e => setUserForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                      placeholder="Enter phone number"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none focus:border-white"
                      required
                    />
                  </div>
                </div>
                <div className="w-full mb-4">
                  <div className="flex items-center border-b border-gray-600">
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={e => setUserForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="Username"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="w-full mb-4">
                  <div className="flex items-center border-b border-gray-600">
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="Email"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="w-full mb-4">
                  <div className="flex items-center border-b border-gray-600">
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Password"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <div className="w-full mb-4">
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm(f => ({ ...f, role: e.target.value.toLowerCase() }))}
                    className="w-full bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg border-b border-gray-600 outline-none focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="expert">Expert</option>
                    <option value="trainer">Trainer</option>
                    <option value="frontdesk">Front Desk Manager</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="admin">Admin</option>
                    <option value="client">Client</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div className="w-full mb-4">
                  <div className="flex items-center border-b border-gray-600">
                    <input
                      type="text"
                      value={userForm.specialty}
                      onChange={e => setUserForm(f => ({ ...f, specialty: e.target.value }))}
                      placeholder="Specialty (optional)"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-lg mb-2 transition-colors bg-white text-black hover:bg-gray-200">Add User</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const EntryPage: React.FC = () => {
  const { user } = useUser();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  // Gym coordinates (you can update these to your actual gym location)
  const GYM_LOCATION = { lat: 12.9716, lng: 77.5946 }; // Example: Bangalore
  const ALLOWED_RADIUS = 100; // meters

  useEffect(() => {
    if (user) {
      fetch(`/api/entry/status?user_id=${user.phone}`)
        .then(r => r.json())
        .then(setStatus);
    }
  }, [user]);

  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      const distance = calculateDistance(
        currentLocation.lat, currentLocation.lng,
        GYM_LOCATION.lat, GYM_LOCATION.lng
      );
      if (distance > ALLOWED_RADIUS) {
        setLocationError(`You are ${Math.round(distance)}m away from the gym. Please come closer to clock in/out.`);
        return false;
      }
      return true;
    } catch (error) {
      setLocationError('Unable to get your location. Please enable location services.');
      return false;
    } finally {
      setLocationLoading(false);
    }
  };

  const handleEntry = async () => {
    if (!user) return;
    
    // Check location first
    const isLocationValid = await checkLocation();
    if (!isLocationValid) return;

    setLoading(true);
    const type = status && status.type === 'in' ? 'out' : 'in';
    const res = await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: user.phone, 
        role: user.role, 
        type,
        location: `lat:${location?.lat},lng:${location?.lng}`
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMessage(`Clocked ${type === 'in' ? 'in' : 'out'} at ${new Date(data.timestamp).toLocaleTimeString()}`);
      setStatus({ ...status, type, timestamp: data.timestamp });
    } else {
      setMessage(data.error || 'Error recording entry');
    }
  };

  if (!user) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><h2 className="text-xl font-bold mb-4">Please log in to record your entry</h2></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Welcome, {user.username}</h2>
        <div className="text-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {user.role}
          </span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Current Status</div>
            <div className={`text-lg font-bold ${status && status.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
              {status && status.type === 'in' ? '🟢 Clocked In' : '🔴 Clocked Out'}
            </div>
          </div>
        </div>

        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm">{locationError}</span>
            </div>
          </div>
        )}

        <button
          className={`w-full py-4 rounded-xl text-white text-lg font-bold mb-4 transition-all transform hover:scale-105 ${
            status && status.type === 'in' 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } ${loading || locationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleEntry}
          disabled={loading || locationLoading}
        >
          {locationLoading ? 'Checking location...' : 
           loading ? 'Processing...' : 
           status && status.type === 'in' ? 'Clock Out' : 'Clock In'}
        </button>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700">{message}</span>
            </div>
          </div>
        )}

        {status && status.timestamp && (
          <div className="text-center text-gray-500 text-sm">
            Last action: {new Date(status.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryPage; 
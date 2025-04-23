import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getUserBookings } from '../lib/supabase';

function UserProfile({ username, onClose }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: username,
    email: 'user@example.com',
    phone: '',
    preferences: {
      notifications: true,
      newsletter: false
    }
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await getUserBookings(profile.id);
        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [profile.id]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Handle profile update logic
    alert('Profile updated successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-500">My Account</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </TabButton>
            <TabButton
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </TabButton>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-500 rounded">
              {error}
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, notifications: e.target.checked }
                    })}
                    className="form-checkbox text-yellow-500"
                  />
                  <span className="text-gray-300">Receive booking notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferences.newsletter}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, newsletter: e.target.checked }
                    })}
                    className="form-checkbox text-yellow-500"
                  />
                  <span className="text-gray-300">Subscribe to newsletter</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-gray-900 py-2 rounded-md hover:bg-yellow-400 transition-colors font-medium"
              >
                Update Profile
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-400">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center text-gray-400">No bookings found</div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-700 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{booking.event.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        booking.payment_status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {booking.payment_status}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      Date: {format(new Date(booking.booking_date), 'PPP')}
                    </p>
                    <p className="text-gray-400">
                      Seat: {booking.seat.seat_number}
                    </p>
                    <p className="text-gray-400">
                      Amount: ₹{booking.amount}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${
        active
          ? 'bg-yellow-500 text-gray-900'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );
}

export default UserProfile;
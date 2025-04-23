import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FaMapMarkerAlt, FaTicketAlt, FaGift } from 'react-icons/fa';

function TicketDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUser(profile);
      }
    };
    getUser();
  }, []);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-yellow-500 mb-4">No booking details found</h2>
          <p className="text-gray-400 mb-6">Please make a booking first</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-md hover:bg-yellow-400"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { 
    bookingId, 
    totalAmount, 
    bookingTime, 
    section, 
    seats, 
    type, 
    concert, 
    gateNumber,
    theater,
    venue
  } = bookingDetails;

  // Get event details based on type
  const event = concert || bookingDetails.event || {
    title: section ? `${type.toUpperCase()} Event - ${section}` : type,
    venue: venue || theater?.name || 'Venue',
    date: bookingTime,
    image: type === 'sport' 
      ? 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e'
      : type === 'concert'
      ? 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1'
  };

  const getVenueMapUrl = () => {
    const venueName = event.venue.replace(/\s+/g, '+');
    return `https://www.google.com/maps/search/?api=1&query=${venueName}`;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return 'Date not available';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return 'Time not available';
    }
  };

  const coupons = [
    {
      code: 'FIRSTSHOW25',
      discount: '25% off',
      description: 'on your next booking'
    },
    {
      code: 'POPCORN50',
      discount: '50% off',
      description: 'on snacks & beverages'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative"
        >
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center transform rotate-12 border-4 border-green-600"
            >
              <div className="text-center text-white">
                <div className="font-bold text-sm">Thanks for</div>
                <div className="font-bold text-sm">Choosing</div>
                <div className="font-bold text-lg">SAMOSA!</div>
              </div>
            </motion.div>
          </div>

          <div className="bg-yellow-500 p-6 text-gray-900">
            <h1 className="text-3xl font-bold text-center">Booking Confirmed!</h1>
            <p className="text-center mt-2">Booking ID: {bookingId}</p>
            {user && (
              <p className="text-center mt-2 font-semibold">
                Booked by: {user.username || user.email}
              </p>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-6 mb-8 bg-gray-700 p-4 rounded-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-40 h-56 object-cover rounded-md shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-yellow-500 mb-2">{event.title}</h2>
                <div className="space-y-2">
                  <p className="text-gray-300 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-yellow-500" />
                    {event.venue}
                  </p>
                  <p className="text-gray-300">{formatDate(event.date)}</p>
                  <p className="text-gray-300">{formatTime(event.date)}</p>
                  {gateNumber && (
                    <p className="text-gray-300">Gate: {gateNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {seats && seats.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-yellow-500 flex items-center">
                  <FaTicketAlt className="mr-2" />
                  Seat Details
                </h3>
                <div className="bg-gray-700 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    {seats.map((seat, index) => (
                      <div key={index} className="text-center p-3 bg-gray-600 rounded-md shadow-inner">
                        <p className="text-lg font-semibold text-yellow-500">{seat}</p>
                        <p className="text-sm text-gray-300">{section || 'Standard'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">Payment Details</h3>
              <div className="bg-gray-700 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Amount Paid</span>
                  <span className="font-semibold text-yellow-500">₹{totalAmount}</span>
                </div>
                {bookingTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Booking Time</span>
                    <span className="text-gray-300">{format(new Date(bookingTime), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-yellow-500 flex items-center">
                <FaGift className="mr-2" />
                Your Rewards
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {coupons.map((coupon, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-md text-center">
                    <div className="text-yellow-500 font-bold mb-2">{coupon.discount}</div>
                    <div className="text-gray-300 text-sm mb-2">{coupon.description}</div>
                    <div className="bg-gray-600 p-2 rounded text-yellow-500 font-mono text-sm">
                      {coupon.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <QRCode
                value={getVenueMapUrl()}
                size={160}
                level="H"
                className="mx-auto bg-white p-3 rounded-lg shadow-lg"
              />
              <p className="mt-3 text-sm text-gray-400">
                Scan to view venue location on Google Maps
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.print()}
                className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Download Ticket
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-md hover:bg-yellow-400 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TicketDetails;
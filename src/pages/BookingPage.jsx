import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes, FaEye } from 'react-icons/fa';
import SeatPreview from '../components/SeatPreview';
import PaymentModal from '../components/PaymentModal';

function BookingPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [maxSelectableSeats, setMaxSelectableSeats] = useState(null);

  const { movie, theater, showtime, date, seatCount } = location.state || {};

  useEffect(() => {
    if (seatCount) {
      setMaxSelectableSeats(seatCount);
    }
  }, [seatCount]);

  useEffect(() => {
    // Simulated API call to get event details and seats
    const fetchEventDetails = () => {
      const mockEvent = {
        id,
        title: movie?.title || (type === 'movie' ? 'Avatar 3' : type === 'sport' ? 'IPL Final' : 'Ed Sheeran Concert'),
        type,
        venue: theater?.name || 'Default Venue',
        date: date || '2024-04-15T14:30:00',
        showtime: showtime || '14:30',
        image: movie?.image || `https://images.unsplash.com/photo-${type === 'movie' ? '1536440136628-849c177e76a1' : 
               type === 'sport' ? '1540747913346-19e32dc3e97e' : '1470229722913-7c0e2dbbafd3'}`,
        price: theater?.price?.classic || (type === 'movie' ? 200 : type === 'sport' ? 500 : 1000)
      };
      setEventDetails(mockEvent);

      const totalSeats = 48;
      const bookedSeats = Array.from({ length: Math.floor(Math.random() * 20) }, 
        () => Math.floor(Math.random() * totalSeats));
      
      const seatArray = Array.from({ length: totalSeats }, (_, index) => ({
        id: index + 1,
        isBooked: bookedSeats.includes(index),
        price: mockEvent.price
      }));

      setSeats(seatArray);
      setLoading(false);
    };

    fetchEventDetails();
  }, [type, id, movie, theater, showtime, date]);

  const handleSeatClick = (seatId) => {
    if (seats.find(seat => seat.id === seatId).isBooked) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else if (prev.length < maxSelectableSeats) {
        return [...prev, seatId];
      }
      return prev;
    });
  };

  const getTotalAmount = () => {
    return selectedSeats.length * (eventDetails?.price || 0);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-yellow-500 text-2xl">Loading...</div>
    </div>;
  }

  if (!maxSelectableSeats) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-xl">Please select number of seats first</div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">
              {eventDetails.title}
            </h1>
            <p className="text-gray-400 mt-2">
              {eventDetails.venue} • {showtime || eventDetails.showtime}
            </p>
            <p className="text-gray-400">
              Select {maxSelectableSeats} {maxSelectableSeats === 1 ? 'seat' : 'seats'}
            </p>
          </div>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <FaEye />
            <span>Preview Layout</span>
          </button>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="mb-8">
            <div className="w-full max-w-3xl mx-auto bg-gray-900 p-6 rounded-lg">
              <div className="w-full h-12 bg-yellow-500 rounded-lg mb-8 text-center text-gray-900 font-bold flex items-center justify-center">
                SCREEN
              </div>
              <div className="grid grid-cols-8 gap-3">
                {seats.map((seat) => (
                  <motion.button
                    key={seat.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSeatClick(seat.id)}
                    className={`
                      relative p-3 rounded-md transition-colors
                      ${seat.isBooked 
                        ? 'bg-gray-800 cursor-not-allowed' 
                        : selectedSeats.includes(seat.id)
                          ? 'bg-yellow-500 text-gray-900'
                          : selectedSeats.length >= maxSelectableSeats
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-gray-600 hover:bg-gray-500'}
                    `}
                    disabled={seat.isBooked || (selectedSeats.length >= maxSelectableSeats && !selectedSeats.includes(seat.id))}
                  >
                    {seat.isBooked ? (
                      <FaTimes className="absolute inset-0 m-auto text-red-500" size={20} />
                    ) : (
                      seat.id
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mb-6 space-x-8">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-600 rounded-md mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-md mr-2"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-800 rounded-md mr-2 relative">
                <FaTimes className="absolute inset-0 m-auto text-red-500" size={16} />
              </div>
              <span className="text-sm">Booked</span>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-lg">
              Selected Seats: {selectedSeats.length} 
              <span className="ml-4 text-yellow-500 font-bold">
                Total: ₹{getTotalAmount()}
              </span>
            </p>
            <button
              onClick={() => selectedSeats.length === maxSelectableSeats && setShowPayment(true)}
              disabled={selectedSeats.length !== maxSelectableSeats}
              className={`px-8 py-3 rounded-md font-bold transition-colors ${
                selectedSeats.length === maxSelectableSeats
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedSeats.length === maxSelectableSeats ? 'Proceed to Payment' : `Select ${maxSelectableSeats - selectedSeats.length} more seats`}
            </button>
          </div>
        </div>
      </motion.div>

      {showPreview && (
        <SeatPreview
          selectedSeats={selectedSeats}
          totalSeats={seats.length}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showPayment && (
        <PaymentModal
          amount={getTotalAmount()}
          onClose={() => setShowPayment(false)}
          selectedSeats={selectedSeats}
          eventDetails={eventDetails}
        />
      )}
    </div>
  );
}

export default BookingPage;
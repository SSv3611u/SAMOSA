import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChair, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

function VIPSeating() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock VIP seats data
  const rows = ['A', 'B', 'C'];
  const seatsPerRow = 10;
  const seatPrice = 3000;

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length > 0) {
      const randomGate = Math.floor(Math.random() * 10) + 1;
      navigate('/payment', {
        state: {
          amount: selectedSeats.length * seatPrice,
          seats: selectedSeats,
          eventId,
          section: 'VIP Stand',
          gateNumber: randomGate,
          type: 'sports'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="p-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">
              VIP Seating Selection
            </h1>

            <div className="mb-8">
              <div className="w-full bg-purple-800 bg-opacity-50 p-6 rounded-lg text-center text-purple-300 font-bold mb-8">
                GROUND
              </div>

              <div className="space-y-6">
                {rows.map(row => (
                  <div key={row} className="flex justify-center space-x-4">
                    <div className="w-8 text-center text-purple-400">{row}</div>
                    {[...Array(seatsPerRow)].map((_, index) => {
                      const seatId = `${row}${index + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      
                      return (
                        <motion.button
                          key={seatId}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSeatClick(seatId)}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${isSelected 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-purple-900 bg-opacity-50 text-purple-300 hover:bg-purple-800'}
                            transition-colors duration-300
                          `}
                        >
                          {isSelected ? <FaCheckCircle /> : <FaChair />}
                        </motion.button>
                      );
                    })}
                    <div className="w-8 text-center text-purple-400">{row}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-purple-300">
                Selected Seats: {selectedSeats.join(', ')}
              </p>
              <p className="text-2xl font-bold text-purple-400">
                Total: ₹{selectedSeats.length * seatPrice}
              </p>
              <button
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className={`
                  px-8 py-3 rounded-lg font-bold
                  ${selectedSeats.length > 0
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                  transition-colors duration-300
                `}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default VIPSeating;
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaArrowLeft } from 'react-icons/fa';

function RegularSeating() {
  const navigate = useNavigate();
  const location = useLocation();
  const { section } = location.state || {};
  const [ticketCount, setTicketCount] = useState(1);
  const maxTickets = 10;

  const handleProceed = () => {
    const randomGate = Math.floor(Math.random() * 10) + 1;
    navigate('/payment', {
      state: {
        amount: ticketCount * section.price,
        ticketCount,
        section: section.name,
        gateNumber: randomGate,
        type: 'sports'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="p-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-6"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
              {section.name}
            </h1>

            <div className="mb-8">
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <FaTicketAlt className="text-4xl text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Price per ticket</p>
                <p className="text-2xl font-bold text-yellow-500">₹{section.price}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 mb-2">Number of Tickets</label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="bg-gray-700 text-white w-10 h-10 rounded-full hover:bg-gray-600"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-white w-16 text-center">
                  {ticketCount}
                </span>
                <button
                  onClick={() => setTicketCount(Math.min(maxTickets, ticketCount + 1))}
                  className="bg-gray-700 text-white w-10 h-10 rounded-full hover:bg-gray-600"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-400 text-center mt-2">
                Maximum {maxTickets} tickets per booking
              </p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-yellow-500">
                Total: ₹{ticketCount * section.price}
              </p>
              <button
                onClick={handleProceed}
                className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-bold"
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

export default RegularSeating;
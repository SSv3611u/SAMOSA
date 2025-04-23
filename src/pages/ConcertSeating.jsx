import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaArrowLeft } from 'react-icons/fa';

function ConcertSeating() {
  const navigate = useNavigate();
  const location = useLocation();
  const { concert } = location.state || {};
  const [selectedSection, setSelectedSection] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const maxTickets = 10;

  const sections = [
    { id: 'platinum', name: 'Platinum', price: 5000, color: 'bg-gray-300' },
    { id: 'gold', name: 'Gold', price: 3500, color: 'bg-yellow-500' },
    { id: 'silver', name: 'Silver', price: 2500, color: 'bg-gray-400' },
    { id: 'bronze', name: 'Bronze', price: 1500, color: 'bg-yellow-700' }
  ];

  const handleProceed = () => {
    navigate('/payment', {
      state: {
        amount: ticketCount * selectedSection.price,
        ticketCount,
        section: selectedSection.name,
        type: 'concert',
        concert
      }
    });
  };

  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
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
                Select Your Section
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSection(section)}
                    className={`${section.color} p-6 rounded-lg text-gray-900 hover:opacity-90`}
                  >
                    <h3 className="text-xl font-bold mb-2">{section.name}</h3>
                    <p className="text-lg">₹{section.price}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
              onClick={() => setSelectedSection(null)}
              className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-6"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
              {selectedSection.name} Section
            </h1>

            <div className="mb-8">
              <div className={`${selectedSection.color} p-6 rounded-lg text-center text-gray-900`}>
                <FaTicketAlt className="text-4xl mx-auto mb-4" />
                <p className="mb-2">Price per ticket</p>
                <p className="text-2xl font-bold">₹{selectedSection.price}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 mb-2">Number of Passes</label>
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
                Maximum {maxTickets} passes per booking
              </p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-yellow-500">
                Total: ₹{ticketCount * selectedSection.price}
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

export default ConcertSeating;
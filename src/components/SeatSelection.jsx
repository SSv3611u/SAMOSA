import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaChair } from 'react-icons/fa';

function SeatSelection({ onSelectSeats, onClose }) {
  const [selectedCount, setSelectedCount] = useState(1);
  const maxSeats = 10;

  const handleConfirm = () => {
    onSelectSeats(selectedCount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          How many seats?
        </h2>

        <div className="flex justify-center mb-8">
          <motion.div className="flex items-center space-x-2">
            <AnimatePresence>
              {[...Array(selectedCount)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                >
                  <FaChair className="text-yellow-500 text-3xl" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedCount(Math.max(1, selectedCount - 1))}
            className="bg-gray-700 text-white w-10 h-10 rounded-full hover:bg-gray-600"
          >
            -
          </button>
          <span className="text-2xl font-bold text-white">{selectedCount}</span>
          <button
            onClick={() => setSelectedCount(Math.min(maxSeats, selectedCount + 1))}
            className="bg-gray-700 text-white w-10 h-10 rounded-full hover:bg-gray-600"
          >
            +
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-400 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SeatSelection;
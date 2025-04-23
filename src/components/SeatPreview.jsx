import { motion } from 'framer-motion';
import { FaChair, FaWheelchair } from 'react-icons/fa';

function SeatPreview({ selectedSeats, totalSeats, onClose }) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 8;

  const getSeatStatus = (seatId) => {
    if (selectedSeats.includes(seatId)) return 'selected';
    const randomStatus = Math.random();
    if (randomStatus < 0.2) return 'booked';
    if (randomStatus < 0.25) return 'accessible';
    return 'available';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-500">Seat Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-700 p-4 rounded-t-lg text-center font-bold text-yellow-500">
            SCREEN
          </div>
          
          <div className="mt-8 space-y-4">
            {rows.map((row) => (
              <div key={row} className="flex justify-center space-x-2">
                <div className="w-8 text-center text-gray-400">{row}</div>
                {[...Array(seatsPerRow)].map((_, index) => {
                  const seatId = `${row}${index + 1}`;
                  const status = getSeatStatus(seatId);
                  return (
                    <motion.div
                      key={seatId}
                      whileHover={{ scale: 1.1 }}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        status === 'selected'
                          ? 'bg-yellow-500 text-gray-900'
                          : status === 'booked'
                          ? 'bg-gray-600 cursor-not-allowed'
                          : status === 'accessible'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {status === 'accessible' ? (
                        <FaWheelchair className="text-sm" />
                      ) : (
                        <FaChair className="text-sm" />
                      )}
                    </motion.div>
                  );
                })}
                <div className="w-8 text-center text-gray-400">{row}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <FaChair className="text-sm" />
            </div>
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
              <FaChair className="text-sm" />
            </div>
            <span className="text-sm text-gray-400">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <FaChair className="text-sm" />
            </div>
            <span className="text-sm text-gray-400">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <FaWheelchair className="text-sm" />
            </div>
            <span className="text-sm text-gray-400">Accessible</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SeatPreview;
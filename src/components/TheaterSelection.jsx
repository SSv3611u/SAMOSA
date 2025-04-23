import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function TheaterSelection({ movie, onSelectShowtime, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for theaters in Hyderabad
  const theaters = [
    {
      id: 1,
      name: "PVR: GVK One Mall",
      location: "Banjara Hills",
      showtimes: ["10:30 AM", "1:45 PM", "4:30 PM", "7:45 PM", "10:30 PM"],
      price: {
        classic: 200,
        prime: 250,
        recliner: 450
      }
    },
    {
      id: 2,
      name: "INOX: GSM Mall",
      location: "Miyapur",
      showtimes: ["11:00 AM", "2:15 PM", "5:00 PM", "8:15 PM", "11:00 PM"],
      price: {
        classic: 180,
        prime: 220,
        recliner: 400
      }
    },
    {
      id: 3,
      name: "AMB Cinemas",
      location: "Gachibowli",
      showtimes: ["9:45 AM", "1:00 PM", "3:45 PM", "7:00 PM", "10:15 PM"],
      price: {
        classic: 250,
        prime: 300,
        recliner: 500
      }
    },
    {
      id: 4,
      name: "Prasads Multiplex",
      location: "Necklace Road",
      showtimes: ["10:00 AM", "1:15 PM", "4:00 PM", "7:15 PM", "10:30 PM"],
      price: {
        classic: 200,
        prime: 250,
        recliner: 450
      }
    }
  ];

  const handleShowtimeSelect = (theater, showtime) => {
    onSelectShowtime({
      theater,
      showtime,
      date: selectedDate
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-500">{movie.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <p className="text-gray-400 mt-2">Select Theater and Showtime in Hyderabad</p>
        </div>

        <div className="p-6">
          {theaters.map((theater) => (
            <div key={theater.id} className="mb-8 bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{theater.name}</h3>
                  <p className="text-gray-400">{theater.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Starting from</p>
                  <p className="text-yellow-500 font-semibold">₹{theater.price.classic}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {theater.showtimes.map((showtime) => (
                  <button
                    key={showtime}
                    onClick={() => handleShowtimeSelect(theater, showtime)}
                    className="bg-gray-600 hover:bg-yellow-500 hover:text-gray-900 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    {showtime}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default TheaterSelection;
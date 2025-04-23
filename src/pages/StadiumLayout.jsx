import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

function StadiumLayout() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [selectedSection, setSelectedSection] = useState(null);

  const sections = [
    { id: 'east', name: 'East Stand', price: 1000 },
    { id: 'west', name: 'West Stand', price: 1200 },
    { id: 'vip', name: 'VIP Stand', price: 3000 },
    { id: 'first', name: 'First Floor', price: 1500 }
  ];

  const handleSectionClick = (section) => {
    if (section.id === 'vip') {
      navigate(`/booking/sports/${eventId}/vip-seats`);
    } else {
      navigate(`/booking/sports/${eventId}/regular-seats`, {
        state: { section, eventId }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
              Select Your Section
            </h1>

            <div className="relative w-full aspect-video mb-8">
              {/* Stadium Layout Image */}
              <img
                src="https://images.unsplash.com/photo-1577223625816-7546f13df25d"
                alt="Stadium Layout"
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Interactive Section Overlays */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSectionClick(section)}
                    className={`
                      ${section.id === 'vip' ? 'bg-purple-500' : 'bg-yellow-500'}
                      bg-opacity-80 rounded-lg p-4 flex flex-col items-center justify-center
                      hover:bg-opacity-90 transition-all duration-300
                    `}
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {section.name}
                    </span>
                    <span className="text-sm text-gray-800 mt-2">
                      Starting from ₹{section.price}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StadiumLayout;
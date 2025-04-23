import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

function Sports() {
  const navigate = useNavigate();
  
  const events = [
    {
      id: 1,
      title: "IPL 2024: MI vs CSK",
      venue: "Wankhede Stadium",
      location: "Mumbai, Maharashtra",
      date: "April 15, 2024",
      time: "7:30 PM",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
      type: "sport",
      sections: [
        { id: 'east', name: 'East Stand', price: 1000 },
        { id: 'west', name: 'West Stand', price: 1200 },
        { id: 'vip', name: 'VIP Stand', price: 3000 },
        { id: 'first', name: 'First Floor', price: 1500 }
      ],
      capacity: "33,000 seats",
      description: "Home of Mumbai Indians"
    },
    {
      id: 2,
      title: "FIFA World Cup Qualifier: India vs Australia",
      venue: "Salt Lake Stadium",
      location: "Kolkata, West Bengal",
      date: "May 2, 2024",
      time: "6:00 PM",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
      type: "sport",
      sections: [
        { id: 'east', name: 'East Stand', price: 800 },
        { id: 'west', name: 'West Stand', price: 1000 },
        { id: 'vip', name: 'VIP Stand', price: 2500 },
        { id: 'first', name: 'First Floor', price: 1200 }
      ],
      capacity: "85,000 seats",
      description: "India's largest football stadium"
    },
    {
      id: 3,
      title: "IPL 2024: GT vs RCB",
      venue: "Narendra Modi Stadium",
      location: "Ahmedabad, Gujarat",
      date: "April 25, 2024",
      time: "7:30 PM",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
      type: "sport",
      sections: [
        { id: 'east', name: 'East Stand', price: 1200 },
        { id: 'west', name: 'West Stand', price: 1400 },
        { id: 'vip', name: 'VIP Stand', price: 3500 },
        { id: 'first', name: 'First Floor', price: 1800 }
      ],
      capacity: "132,000 seats",
      description: "World's largest cricket stadium"
    }
  ];

  const handleSectionClick = (eventId, section) => {
    if (section.id === 'vip') {
      navigate(`/booking/sports/${eventId}/vip-seats`);
    } else {
      navigate(`/booking/sports/${eventId}/regular-seats`, {
        state: { section, eventId }
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center mb-8"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </button>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 text-yellow-500"
      >
        Sports Events
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300"
          >
            <div className="relative">
              <motion.img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => navigate(`/stadium-layout/${event.id}`)}
              />
              <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-3 py-1 m-2 rounded-full text-sm font-bold">
                {event.venue}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <div className="space-y-2 text-gray-400 mb-4">
                <p>🏟️ {event.venue}</p>
                <p>📍 {event.location}</p>
                <p>👥 {event.capacity}</p>
                <p>📅 {event.date}</p>
                <p>⏰ {event.time}</p>
                <p className="text-sm italic">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {event.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(event.id, section)}
                    className={`p-2 rounded-md text-sm font-medium transition-colors
                      ${section.id === 'vip'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'}`}
                  >
                    {section.name}
                    <div className="text-xs">₹{section.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Sports;
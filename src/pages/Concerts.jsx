import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

function Concerts() {
  const navigate = useNavigate();
  
  const concerts = [
    {
      id: 1,
      title: "Anirudh Live in Concert",
      artist: "Anirudh Ravichandar",
      venue: "Palace Grounds",
      location: "Bangalore, Karnataka",
      date: "April 25, 2024",
      time: "7:00 PM",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
      type: "concert",
      duration: "3 hours",
      description: "Bangalore's premier open-air venue"
    },
    {
      id: 2,
      title: "Dil se DSP",
      artist: "Devi Sri Prasad",
      venue: "MMRDA Grounds",
      location: "Mumbai, Maharashtra",
      date: "May 5, 2024",
      time: "6:30 PM",
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
      type: "concert",
      duration: "2.5 hours",
      description: "Mumbai's largest outdoor venue"
    },
    {
      id: 3,
      title: "AR Rahman - Secret Notes",
      artist: "AR Rahman",
      venue: "Buddh International Circuit",
      location: "Greater Noida, UP",
      date: "June 10, 2024",
      time: "8:00 PM",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
      type: "concert",
      duration: "3 hours",
      description: "Spectacular open-air concert experience"
    }
  ];

  const handleBooking = (concert) => {
    navigate(`/booking/concert/${concert.id}/seating`, {
      state: { concert }
    });
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
        Live Concerts
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {concerts.map((concert) => (
          <motion.div
            key={concert.id}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300"
          >
            <div className="relative">
              <img src={concert.image} alt={concert.title} className="w-full h-48 object-cover" />
              <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-3 py-1 m-2 rounded-full text-sm font-bold">
                {concert.venue}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{concert.title}</h3>
              <div className="space-y-2 text-gray-400 mb-4">
                <p>🎤 {concert.artist}</p>
                <p>📍 {concert.location}</p>
                <p>📅 {concert.date}</p>
                <p>⏰ {concert.time}</p>
                <p>⌛ Duration: {concert.duration}</p>
                <p className="text-sm italic">{concert.description}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBooking(concert)}
                className="w-full bg-yellow-500 text-gray-900 py-2 rounded-md hover:bg-yellow-400 transition-colors transform"
              >
                Book Tickets
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Concerts;
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';

function Deals() {
  const navigate = useNavigate();
  const [ticketCounts, setTicketCounts] = useState({});
  const [selectedCategories, setSelectedCategories] = useState({});
  const maxTickets = 10;
  
  const deals = [
    {
      id: 1,
      title: "Last Minute: Avatar 3",
      type: "movie",
      venue: "PVR: GVK One Mall",
      originalPrice: 500,
      discountedPrice: 150, // Significantly reduced from original 500
      discount: "70%",
      seatsLeft: 15,
      time: "Today, 9:30 PM",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      categories: null
    },
    {
      id: 2,
      title: "IPL: RCB vs KKR",
      type: "sport",
      venue: "Chinnaswamy Stadium",
      discount: "65%",
      seatsLeft: 25,
      time: "Tomorrow, 7:30 PM",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      categories: [
        { id: 'east', name: 'East Stand', originalPrice: 2000, discountedPrice: 700 }, // Heavy discount from 2000
        { id: 'west', name: 'West Stand', originalPrice: 2500, discountedPrice: 875 }, // Heavy discount from 2500
        { id: 'vip', name: 'VIP Stand', originalPrice: 5000, discountedPrice: 1750 }, // Heavy discount from 5000
      ]
    },
    {
      id: 3,
      title: "Local Indie Concert",
      type: "concert",
      venue: "Phoenix Marketcity",
      discount: "75%",
      seatsLeft: 30,
      time: "Today, 8:00 PM",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      categories: [
        { id: 'silver', name: 'Silver', originalPrice: 1500, discountedPrice: 375 }, // Heavy discount from 1500
        { id: 'gold', name: 'Gold', originalPrice: 2500, discountedPrice: 625 }, // Heavy discount from 2500
        { id: 'platinum', name: 'Platinum', originalPrice: 4000, discountedPrice: 1000 }, // Heavy discount from 4000
      ]
    }
  ];

  const handleTicketChange = (dealId, increment) => {
    setTicketCounts(prev => {
      const currentCount = prev[dealId] || 1;
      const newCount = increment 
        ? Math.min(currentCount + 1, maxTickets)
        : Math.max(currentCount - 1, 1);
      return { ...prev, [dealId]: newCount };
    });
  };

  const getTicketCount = (dealId) => {
    return ticketCounts[dealId] || 1;
  };

  const handleCategorySelect = (dealId, category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [dealId]: category
    }));
  };

  const getSelectedCategory = (deal) => {
    if (!deal.categories) return null;
    return selectedCategories[deal.id] || deal.categories[0];
  };

  const getCurrentPrice = (deal) => {
    if (!deal.categories) return deal.discountedPrice;
    const category = getSelectedCategory(deal);
    return category.discountedPrice;
  };

  const getOriginalPrice = (deal) => {
    if (!deal.categories) return deal.originalPrice;
    const category = getSelectedCategory(deal);
    return category.originalPrice;
  };

  const handleBooking = (deal) => {
    const category = getSelectedCategory(deal);
    if (deal.type === 'concert') {
      navigate(`/booking/concert/${deal.id}/seating`, {
        state: {
          concert: {
            ...deal,
            price: getCurrentPrice(deal)
          },
          section: category.name,
          ticketCount: getTicketCount(deal.id)
        }
      });
    } else if (deal.type === 'sport') {
      navigate(`/booking/sports/${deal.id}/regular-seats`, {
        state: {
          section: {
            name: category.name,
            price: getCurrentPrice(deal)
          },
          eventId: deal.id
        }
      });
    } else {
      navigate(`/booking/${deal.type}/${deal.id}`, {
        state: {
          event: {
            ...deal,
            price: getCurrentPrice(deal)
          },
          theater: {
            name: deal.venue,
            price: {
              regular: getCurrentPrice(deal)
            }
          },
          showtime: deal.time,
          date: new Date(),
          seatCount: getTicketCount(deal.id)
        }
      });
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
        Last Minute Deals
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative"
          >
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full z-10">
              {deal.discount} OFF
            </div>
            <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="text-sm text-gray-400 capitalize">{deal.type}</span>
              <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
              <div className="space-y-2 text-gray-400 mb-4">
                <p>🏢 {deal.venue}</p>
                <p>⏰ {deal.time}</p>
                <p>🎟️ {deal.seatsLeft} seats left</p>
              </div>

              {deal.categories ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {deal.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(deal.id, category)}
                      className={`p-2 rounded-md text-sm font-medium transition-colors
                        ${getSelectedCategory(deal)?.id === category.id
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {category.name}
                      <div className="text-xs mt-1">
                        <span className="line-through">₹{category.originalPrice}</span>
                        {' '}₹{category.discountedPrice}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="line-through text-gray-400">₹{deal.originalPrice}</span>
                  <span className="text-yellow-500 font-bold">₹{deal.discountedPrice}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 bg-gray-700 p-2 rounded-lg">
                  <button
                    onClick={() => handleTicketChange(deal.id, false)}
                    className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="text-lg font-semibold text-white w-8 text-center">
                    {getTicketCount(deal.id)}
                  </span>
                  <button
                    onClick={() => handleTicketChange(deal.id, true)}
                    className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => handleBooking(deal)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors font-medium"
                >
                  Book for ₹{getCurrentPrice(deal) * getTicketCount(deal.id)}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Deals;
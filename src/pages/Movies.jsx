import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TheaterSelection from '../components/TheaterSelection';
import SeatSelection from '../components/SeatSelection';

function Movies() {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTheaters, setShowTheaters] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const movies = [
    {
      id: 1,
      title: "Avatar 3",
      genre: "Sci-Fi",
      rating: "UA",
      duration: "2h 45m",
      image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1",
      status: "Now Showing"
    },
    {
      id: 2,
      title: "Deadpool 3",
      genre: "Action/Comedy",
      rating: "A",
      duration: "2h 15m",
      image: "https://images.unsplash.com/photo-1535016120720-40c646be5580",
      status: "Now Showing"
    },
    {
      id: 3,
      title: "Kung Fu Panda 4",
      genre: "Animation",
      rating: "U",
      duration: "1h 55m",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
      status: "Now Showing"
    }
  ];

  const comingSoon = [
    {
      id: 4,
      title: "Joker 2",
      genre: "Drama/Thriller",
      expectedDate: "June 2024",
      image: "https://images.unsplash.com/photo-1559583109-44c9134a36d6"
    },
    {
      id: 5,
      title: "Captain America: Brave New World",
      genre: "Action/Adventure",
      expectedDate: "July 2024",
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe"
    }
  ];

  const handleShowtimeSelect = ({ theater, showtime, date }) => {
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
    setSelectedDate(date);
    setShowTheaters(false);
    setShowSeatSelection(true);
  };

  const handleSeatSelection = (seatCount) => {
    setShowSeatSelection(false);
    navigate(`/booking/movie/${selectedMovie.id}`, {
      state: {
        movie: selectedMovie,
        theater: selectedTheater,
        showtime: selectedShowtime,
        date: selectedDate,
        seatCount
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 text-yellow-500"
      >
        Now Showing
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
          >
            <img src={movie.image} alt={movie.title} className="w-full h-96 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>{movie.genre}</span>
                <span>{movie.rating}</span>
                <span>{movie.duration}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedMovie(movie);
                  setShowTheaters(true);
                }}
                className="w-full bg-yellow-500 text-gray-900 py-2 rounded-md hover:bg-yellow-400 transition-colors"
              >
                Book Tickets
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-yellow-500"
      >
        Coming Soon
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {comingSoon.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative"
          >
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
              Coming Soon
            </div>
            <img src={movie.image} alt={movie.title} className="w-full h-96 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
              <div className="text-sm text-gray-400 mb-4">
                <p>{movie.genre}</p>
                <p className="text-yellow-500 mt-1">Expected: {movie.expectedDate}</p>
              </div>
              <button 
                className="w-full bg-gray-700 text-gray-300 py-2 rounded-md cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showTheaters && selectedMovie && (
        <TheaterSelection
          movie={selectedMovie}
          onSelectShowtime={handleShowtimeSelect}
          onClose={() => setShowTheaters(false)}
        />
      )}

      {showSeatSelection && (
        <SeatSelection
          onSelectSeats={handleSeatSelection}
          onClose={() => setShowSeatSelection(false)}
        />
      )}
    </div>
  );
}

export default Movies;
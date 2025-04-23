import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

function Home() {
  const navigate = useNavigate();

  const backgroundSlides = [
    {
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      title: "Movies"
    },
    {
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
      title: "Sports"
    },
    {
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
      title: "Concerts"
    }
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="absolute inset-0"
      >
        {backgroundSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-screen w-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${slide.image})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-yellow-500 mb-6">
            SAMOSA
          </h1>
          <p className="text-2xl text-white mb-12">
            The ultimate destination for entertainment!
          </p>
          <div className="flex space-x-6">
            <CategoryButton
              title="Movies"
              icon="🎬"
              onClick={() => navigate('/movies')}
            />
            <CategoryButton
              title="Sports"
              icon="⚽"
              onClick={() => navigate('/sports')}
            />
            <CategoryButton
              title="Concerts"
              icon="🎸"
              onClick={() => navigate('/concerts')}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CategoryButton({ title, icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-yellow-400 transition-colors"
    >
      <span className="text-2xl mb-2 block">{icon}</span>
      {title}
    </motion.button>
  );
}

export default Home;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Sports from './pages/Sports';
import Concerts from './pages/Concerts';
import Deals from './pages/Deals';
import BookingPage from './pages/BookingPage';
import TicketDetails from './pages/TicketDetails';
import StadiumLayout from './pages/StadiumLayout';
import VIPSeating from './pages/VIPSeating';
import RegularSeating from './pages/RegularSeating';
import ConcertSeating from './pages/ConcertSeating';
import Payment from './pages/Payment';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-900 text-white">
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/concerts" element={<Concerts />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/booking/:type/:id" element={<BookingPage />} />
            <Route path="/ticket-details" element={<TicketDetails />} />
            <Route path="/stadium-layout/:eventId" element={<StadiumLayout />} />
            <Route path="/booking/sports/:eventId/vip-seats" element={<VIPSeating />} />
            <Route path="/booking/sports/:eventId/regular-seats" element={<RegularSeating />} />
            <Route path="/booking/concert/:id/seating" element={<ConcertSeating />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
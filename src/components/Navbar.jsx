import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaFootballBall, FaGuitar, FaPercent, FaUserCircle } from 'react-icons/fa';
import SignInModal from './SignInModal';
import UserProfile from './UserProfile';
import { supabase } from '../lib/supabase';

function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email) => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return;
    }
    
    if (session) {
      setIsLoggedIn(true);
      setUser(session.user);
      setIsSignInOpen(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }
    
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-yellow-500">SAMOSA</span>
          </Link>
          
          <div className="flex space-x-8">
            <NavLink to="/movies" icon={<FaFilm />} text="Movies" />
            <NavLink to="/sports" icon={<FaFootballBall />} text="Sports" />
            <NavLink to="/concerts" icon={<FaGuitar />} text="Concerts" />
            <NavLink to="/deals" icon={<FaPercent />} text="Last Minute Deals" />
          </div>
          
          <div className="flex items-center space-x-4 relative">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span className="text-gray-300">{user?.email}</span>
                  <FaUserCircle className="text-yellow-500 text-2xl" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsSignInOpen(true)}
                className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)}
        onSignIn={handleSignIn}
      />

      {isProfileOpen && (
        <UserProfile
          username={user?.email}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
}

function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default Navbar;
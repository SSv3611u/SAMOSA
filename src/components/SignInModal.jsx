import { useState } from 'react';
import { motion } from 'framer-motion';
import OTPVerification from './OTPVerification';
import { signIn, signUp } from '../lib/supabase';

function SignInModal({ isOpen, onClose, onSignIn }) {
  const [email, setEmail] = useState('dowhatyoudo02@gmail.com');
  const [password, setPassword] = useState('123456');
  const [phone, setPhone] = useState('9876543210');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;
        // Auto sign in after sign up
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        onSignIn(email);
        setShowOTP(true);
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        onSignIn(email);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    onSignIn(email);
    setEmail('');
    setPassword('');
    setPhone('');
    setShowOTP(false);
  };

  if (showOTP) {
    return (
      <OTPVerification
        phone={phone}
        onVerificationSuccess={handleOTPSuccess}
        onBack={() => setShowOTP(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-500 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              disabled={loading}
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="phone" className="block text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                disabled={loading}
              />
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-400 transition-colors font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-yellow-500 hover:text-yellow-400"
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SignInModal;
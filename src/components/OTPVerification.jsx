import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function OTPVerification({ phone, onVerificationSuccess, onBack, onClose }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement.nextSibling.querySelector('input');
      nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousSibling.querySelector('input');
      prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOTP = otp.join('');
    
    // Simulate OTP verification
    if (enteredOTP === '123456') { // In real app, verify with backend
      onVerificationSuccess();
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    // Simulate OTP resend
    setTimeout(() => {
      setTimer(30);
      setIsResending(false);
      alert('New OTP has been sent to your phone');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">
            Verify Your Phone
          </h2>
          <p className="text-gray-400">
            We've sent a verification code to {phone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between max-w-xs mx-auto">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-12 text-center text-2xl bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-gray-400">
                Resend code in {timer} seconds
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-yellow-500 hover:text-yellow-400"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-3 rounded-md hover:bg-yellow-400 transition-colors font-medium"
          >
            Verify OTP
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default OTPVerification;
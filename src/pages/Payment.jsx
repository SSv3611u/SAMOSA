import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCreditCard, FaLock, FaArrowLeft } from 'react-icons/fa';
import { SiGooglepay, SiPaytm, SiPhonepe } from 'react-icons/si';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, type, ticketCount, section, seats, gateNumber, concert } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate a random booking ID
    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Generate random gate number if not provided
    const randomGate = gateNumber || Math.floor(Math.random() * 10) + 1;

    setTimeout(() => {
      setLoading(false);
      navigate('/ticket-details', {
        state: {
          bookingDetails: {
            bookingId,
            type,
            section,
            seats: seats || Array(ticketCount).fill().map((_, i) => `${section} - ${i + 1}`),
            totalAmount: amount,
            gateNumber: randomGate,
            bookingTime: new Date().toISOString(),
            paymentMethod,
            concert
          }
        }
      });
    }, 2000);
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=SamosaBooking&am=${amount}&cu=INR`;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
        >
          <div className="p-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-6"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <h2 className="text-2xl font-bold text-yellow-500 mb-6">Payment</h2>

            <div className="mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-gray-300">Total Amount:</span>
                <span className="text-2xl font-bold text-yellow-500">₹{amount}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    paymentMethod === 'card'
                      ? 'border-yellow-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <FaCreditCard className="mx-auto mb-2 text-2xl text-yellow-500" />
                  <div className="text-sm text-center text-gray-300">Credit/Debit Card</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    paymentMethod === 'upi'
                      ? 'border-yellow-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <div className="flex justify-center space-x-2 mb-2">
                    <SiGooglepay className="text-2xl text-blue-500" />
                    <SiPaytm className="text-2xl text-blue-400" />
                    <SiPhonepe className="text-2xl text-purple-500" />
                  </div>
                  <div className="text-sm text-center text-gray-300">UPI/Wallets</div>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    maxLength="16"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="3"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Card Holder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-gray-900 py-3 rounded-md hover:bg-yellow-400 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <FaLock />
                  <span>{loading ? 'Processing...' : 'Pay Securely'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <img
                    src={generateQRCode()}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto mb-4"
                  />
                  <p className="text-gray-300">Scan QR code using any UPI app</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <SiGooglepay className="text-3xl text-blue-500" />
                    <SiPaytm className="text-3xl text-blue-400" />
                    <SiPhonepe className="text-3xl text-purple-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-400">or</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., name@upi)"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-yellow-500 text-gray-900 py-3 rounded-md hover:bg-yellow-400 transition-colors font-medium"
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
              <FaLock className="mr-2" />
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Payment;
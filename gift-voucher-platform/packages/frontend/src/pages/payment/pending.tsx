import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOrders } from '../../hooks/useOrders';
import { usePayments } from '../../hooks/usePayments';
import Link from 'next/link';
import { PaymentStatus } from '../../components/payments';

const PaymentPendingPage: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { updateOrderPayment } = usePayments();
  const { fetchOrderById, currentOrder } = useOrders();

  useEffect(() => {
    if (orderId && typeof orderId === 'string') {
      // Fetch the order details
      fetchOrderById(orderId);
      
      // Update the order payment status to pending
      updateOrderPayment(orderId, {
        paymentStatus: 'pending'
      });
    }
  }, [orderId, fetchOrderById, updateOrderPayment]);

  const handleStatusChange = (status: 'pending' | 'completed' | 'failed') => {
    if (status === 'completed' && orderId) {
      router.push(`/payment/success?orderId=${orderId}`);
    } else if (status === 'failed' && orderId) {
      router.push(`/payment/failure?orderId=${orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-medium text-gray-900">Payment Pending</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your payment is being processed. This page will update automatically when the payment is complete.
            </p>
            
            {currentOrder && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Order ID:</span> {currentOrder._id}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Amount:</span> ${currentOrder.paymentDetails.amount.toFixed(2)}
                </p>
              </div>
            )}
            
            {orderId && typeof orderId === 'string' && (
              <div className="mt-4">
                <PaymentStatus orderId={orderId} onStatusChange={handleStatusChange} />
              </div>
            )}
            
            <div className="mt-6 flex flex-col space-y-2">
              {orderId && (
                <Link 
                  href={`/orders/${orderId}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Order Details
                </Link>
              )}
              <Link 
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage; 
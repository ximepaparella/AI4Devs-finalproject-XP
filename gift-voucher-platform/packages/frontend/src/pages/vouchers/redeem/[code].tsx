import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/services/api';

interface VoucherData {
  _id: string;
  code: string;
  status: 'active' | 'redeemed' | 'expired';
  expirationDate: string;
  qrCode: string;
}

const VoucherRedeemPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [voucher, setVoucher] = useState<VoucherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState<string>('');

  useEffect(() => {
    const fetchVoucher = async () => {
      if (!code || typeof code !== 'string') return;

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/vouchers/code/${code}`);
        
        if (response.data.success) {
          setVoucher(response.data.data);
        } else {
          setError(response.data.error || 'Failed to fetch voucher');
        }
      } catch (error: any) {
        console.error('Error fetching voucher:', error);
        setError(error.response?.data?.message || 'Failed to fetch voucher');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchVoucher();
    }
  }, [code, router.isReady]);

  const handleRedeemVoucher = async () => {
    if (!code || typeof code !== 'string') return;

    try {
      setRedeemStatus('loading');
      setRedeemMessage('');
      
      const response = await api.put(`/vouchers/code/${code}/redeem`);
      
      if (response.data.success) {
        setRedeemStatus('success');
        setRedeemMessage(response.data.message || 'Voucher successfully redeemed!');
        // Update the voucher data
        setVoucher(response.data.data);
      } else {
        setRedeemStatus('error');
        setRedeemMessage(response.data.error || 'Failed to redeem voucher');
      }
    } catch (error: any) {
      console.error('Error redeeming voucher:', error);
      setRedeemStatus('error');
      setRedeemMessage(error.response?.data?.message || 'Failed to redeem voucher');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'redeemed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Head>
          <title>Redeeming Voucher | Gift Voucher Platform</title>
          <meta name="description" content="Redeem your gift voucher" />
        </Head>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading voucher information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Head>
          <title>Error | Gift Voucher Platform</title>
          <meta name="description" content="Error redeeming voucher" />
        </Head>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Voucher Error</h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <Head>
          <title>Voucher Not Found | Gift Voucher Platform</title>
          <meta name="description" content="Voucher not found" />
        </Head>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Voucher Not Found</h1>
          <p className="text-center text-gray-600 mb-6">The voucher you are looking for could not be found.</p>
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Head>
        <title>Redeem Voucher | Gift Voucher Platform</title>
        <meta name="description" content="Redeem your gift voucher" />
      </Head>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <img 
            src={voucher.qrCode} 
            alt={`QR Code for voucher ${voucher.code}`}
            className="w-32 h-32"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Voucher: {voucher.code}</h1>
        
        <div className="flex justify-center mb-6">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(voucher.status)}`}>
            {voucher.status}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Expiration Date:</p>
          <p className="text-base font-medium">{formatDate(voucher.expirationDate)}</p>
        </div>
        
        {voucher.status === 'active' && (
          <div className="mb-6">
            {redeemStatus === 'idle' && (
              <button
                onClick={handleRedeemVoucher}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Redeem This Voucher
              </button>
            )}
            
            {redeemStatus === 'loading' && (
              <button
                disabled
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-400 cursor-not-allowed"
              >
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </button>
            )}
          </div>
        )}
        
        {redeemStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{redeemMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {redeemStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{redeemMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {voucher.status === 'redeemed' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">This voucher has already been redeemed.</p>
              </div>
            </div>
          </div>
        )}
        
        {voucher.status === 'expired' && (
          <div className="mb-6 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">This voucher has expired.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoucherRedeemPage; 
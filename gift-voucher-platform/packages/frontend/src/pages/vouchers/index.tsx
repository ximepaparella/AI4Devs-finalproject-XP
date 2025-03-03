import React, { useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useVouchers } from '@/hooks/useVouchers';
import { VouchersTable } from '@/components/vouchers/VouchersTable';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';

const VouchersPage: NextPage = () => {
  const { user } = useAuth();
  const { vouchers, loading, error, fetchVouchers, deleteVoucher, redeemVoucher } = useVouchers();

  // Fetch vouchers on component mount
  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const success = await deleteVoucher(id);
      if (success) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  }, [deleteVoucher, fetchVouchers]);

  const handleRedeem = useCallback(async (id: string) => {
    try {
      const success = await redeemVoucher(id);
      if (success) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error redeeming voucher:', error);
    }
  }, [redeemVoucher, fetchVouchers]);

  return (
    <DashboardLayout>
      <Head>
        <title>Vouchers | Gift Voucher Platform</title>
        <meta name="description" content="Manage gift vouchers" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Vouchers</h1>
            {user && (user.role === 'admin' || user.role === 'store_manager') && (
              <Link 
                href="/vouchers/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Voucher
              </Link>
            )}
          </div>

          <div className="mt-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <VouchersTable 
                vouchers={vouchers} 
                onDelete={handleDelete} 
                onRedeem={user && (user.role === 'admin' || user.role === 'store_manager') ? handleRedeem : undefined}
                isLoading={loading} 
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VouchersPage; 
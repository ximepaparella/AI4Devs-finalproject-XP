import React, { useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { VoucherForm } from '@/components/vouchers/VoucherForm';
import { useVouchers, UpdateVoucherData } from '@/hooks/useVouchers';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';

const EditVoucherPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentVoucher, loading, error, fetchVoucherById, updateVoucher, redeemVoucher } = useVouchers();
  const { user, isAuthenticated, isLoading } = useAuth();

  const fetchVoucher = useCallback(async () => {
    if (id && typeof id === 'string') {
      await fetchVoucherById(id);
    }
  }, [id, fetchVoucherById]);

  useEffect(() => {
    if (router.isReady) {
      fetchVoucher();
    }
  }, [router.isReady, fetchVoucher]);

  const handleSubmit = useCallback(async (data: UpdateVoucherData) => {
    try {
      if (id && typeof id === 'string') {
        const success = await updateVoucher(id, data);
        if (success) {
          router.push('/vouchers');
        }
      }
    } catch (error) {
      console.error('Error updating voucher:', error);
    }
  }, [id, updateVoucher, router]);

  const handleRedeem = useCallback(async (voucherId: string) => {
    try {
      const success = await redeemVoucher(voucherId);
      if (success) {
        // Refresh the voucher data
        fetchVoucher();
      }
    } catch (error) {
      console.error('Error redeeming voucher:', error);
    }
  }, [redeemVoucher, fetchVoucher]);

  // Redirect if not authenticated or not admin/store manager
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!isLoading && user && user.role !== 'admin' && user.role !== 'store_manager') {
    router.push('/dashboard');
    return null;
  }

  // Show loading state while router is initializing
  if (!router.isReady) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Edit Voucher | Gift Voucher Platform</title>
        <meta name="description" content="Edit an existing voucher" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Voucher: {currentVoucher?.code}
            </h1>
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

            <div className="mt-4 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {currentVoucher ? (
                  <VoucherForm 
                    initialData={currentVoucher} 
                    onSubmit={handleSubmit} 
                    onRedeem={handleRedeem}
                    isLoading={loading} 
                  />
                ) : loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2">Loading voucher data...</span>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Voucher not found</p>
                    <button
                      type="button"
                      onClick={() => router.push('/vouchers')}
                      className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Go back to vouchers
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditVoucherPage; 
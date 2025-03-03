import { useState, useCallback } from 'react';
import api from '@/services/api';

export interface Voucher {
  _id: string;
  storeId: string;
  productId: string;
  customerId: string | null;
  code: string;
  status: 'active' | 'redeemed' | 'expired';
  expirationDate: string;
  qrCode: string;
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  message: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export function useVouchers() {
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get a voucher by its code
   * @param code - The code of the voucher to fetch
   */
  const getVoucherByCode = async (code: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/orders/voucher/${code}`);
      
      if (response.data.success) {
        setCurrentVoucher(response.data.data);
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

  /**
   * Redeem a voucher by its code
   * @param voucherCode - The code of the voucher to redeem
   */
  const redeemVoucher = async (voucherCode: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/orders/voucher/${voucherCode}/redeem`);
      
      if (response.data.success) {
        // Update the current voucher if it matches the redeemed one
        if (currentVoucher && currentVoucher.code === voucherCode) {
          setCurrentVoucher({
            ...currentVoucher,
            status: 'redeemed'
          });
        }
        return true;
      } else {
        setError(response.data.error || 'Failed to redeem voucher');
        return false;
      }
    } catch (error: any) {
      console.error('Error redeeming voucher:', error);
      setError(error.response?.data?.message || 'Failed to redeem voucher');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentVoucher,
    loading,
    error,
    getVoucherByCode,
    redeemVoucher
  };
} 
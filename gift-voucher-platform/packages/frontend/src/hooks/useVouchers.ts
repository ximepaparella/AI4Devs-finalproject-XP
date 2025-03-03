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
  productName?: string;
}

export interface CreateVoucherData {
  storeId: string;
  productId: string;
  customerId?: string;
  expirationDate: string;
  status?: 'active' | 'redeemed' | 'expired';
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  message: string;
  template: string;
}

export interface UpdateVoucherData {
  customerId?: string;
  status?: 'active' | 'redeemed' | 'expired';
  expirationDate?: string;
  sender_name?: string;
  sender_email?: string;
  receiver_name?: string;
  receiver_email?: string;
  message?: string;
  template?: string;
}

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async (filters?: { 
    storeId?: string; 
    productId?: string; 
    customerId?: string; 
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/vouchers';
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.storeId) queryParams.append('storeId', filters.storeId);
        if (filters.productId) queryParams.append('productId', filters.productId);
        if (filters.customerId) queryParams.append('customerId', filters.customerId);
        if (filters.status) queryParams.append('status', filters.status);
        
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const response = await api.get(url);
      
      if (response.data.success) {
        setVouchers(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch vouchers');
      }
    } catch (error: any) {
      console.error('Error fetching vouchers:', error);
      setError(error.response?.data?.message || 'Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVoucherById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/vouchers/${id}`);
      
      if (response.data.success) {
        const voucher = response.data.data;
        
        // Fetch product details to get the product name
        try {
          const productResponse = await api.get(`/products/${voucher.productId}`);
          if (productResponse.data.success) {
            voucher.productName = productResponse.data.data.name;
          }
        } catch (productError) {
          console.error('Error fetching product details:', productError);
          // Continue even if product fetch fails
        }
        
        setCurrentVoucher(voucher);
      } else {
        setError(response.data.error || 'Failed to fetch voucher');
      }
    } catch (error: any) {
      console.error('Error fetching voucher:', error);
      setError(error.response?.data?.message || 'Failed to fetch voucher');
    } finally {
      setLoading(false);
    }
  }, []);

  const createVoucher = useCallback(async (data: CreateVoucherData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating voucher with data:', data);
      
      const response = await api.post('/vouchers', data);
      
      if (response.data.success) {
        return true;
      } else {
        setError(response.data.error || 'Failed to create voucher');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      setError(error.response?.data?.message || 'Failed to create voucher');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVoucher = useCallback(async (id: string, data: UpdateVoucherData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating voucher with data:', data);
      
      const response = await api.put(`/vouchers/${id}`, data);
      
      if (response.data.success) {
        setCurrentVoucher(response.data.data);
        return true;
      } else {
        setError(response.data.error || 'Failed to update voucher');
        return false;
      }
    } catch (error: any) {
      console.error('Error updating voucher:', error);
      setError(error.response?.data?.message || 'Failed to update voucher');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVoucher = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.delete(`/vouchers/${id}`);
      
      if (response.data.success) {
        setVouchers(prevVouchers => prevVouchers.filter(voucher => voucher._id !== id));
        return true;
      } else {
        setError(response.data.error || 'Failed to delete voucher');
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting voucher:', error);
      setError(error.response?.data?.message || 'Failed to delete voucher');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const redeemVoucher = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get the voucher to obtain its code
      const voucherResponse = await api.get(`/vouchers/${id}`);
      
      if (!voucherResponse.data.success) {
        setError(voucherResponse.data.error || 'Failed to fetch voucher for redemption');
        return false;
      }
      
      const voucherCode = voucherResponse.data.data.code;
      
      // Now redeem the voucher using its code
      const response = await api.put(`/vouchers/code/${voucherCode}/redeem`);
      
      if (response.data.success) {
        // Update the voucher in the list
        setVouchers(prevVouchers => 
          prevVouchers.map(voucher => 
            voucher._id === id 
              ? { ...voucher, status: 'redeemed' } 
              : voucher
          )
        );
        
        // Update current voucher if it's the one being redeemed
        if (currentVoucher && currentVoucher._id === id) {
          setCurrentVoucher({ ...currentVoucher, status: 'redeemed' });
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
  }, [currentVoucher]);

  return {
    vouchers,
    currentVoucher,
    loading,
    error,
    fetchVouchers,
    fetchVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    redeemVoucher
  };
} 
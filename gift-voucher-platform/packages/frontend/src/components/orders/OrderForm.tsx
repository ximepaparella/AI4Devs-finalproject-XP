import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Order, CreateOrderData } from '@/hooks/useOrders';
import api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Voucher {
  _id: string;
  code: string;
  status: string;
  productId: string;
  productName?: string;
}

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: CreateOrderData) => Promise<void>;
  isLoading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CreateOrderData>({
    defaultValues: initialData ? {
      customerId: initialData.customerId,
      voucherId: initialData.voucherId,
      paymentDetails: {
        paymentId: initialData.paymentDetails.paymentId,
        paymentStatus: initialData.paymentDetails.paymentStatus,
        paymentEmail: initialData.paymentDetails.paymentEmail,
        amount: initialData.paymentDetails.amount,
        provider: initialData.paymentDetails.provider
      }
    } : {
      paymentDetails: {
        paymentStatus: 'pending',
        provider: 'paypal'
      }
    }
  });

  // Watch the form values for debugging
  const formValues = watch();
  console.log('Current form values:', formValues);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        setCustomerError(null);
        const response = await api.get('/users');
        if (response.data.success) {
          // Filter users to only include customers
          const customerUsers = response.data.data.filter(
            (user: User) => user.role === 'customer'
          );
          if (customerUsers.length === 0) {
            setCustomerError('No customers found. Please create a customer user first.');
          }
          setCustomers(customerUsers);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomerError('Failed to load customers. Please try again.');
      } finally {
        setLoadingCustomers(false);
      }
    };

    const fetchVouchers = async () => {
      try {
        setLoadingVouchers(true);
        setVoucherError(null);
        const response = await api.get('/vouchers');
        if (response.data.success) {
          // Only include active vouchers that don't have a customer assigned yet
          const availableVouchers = response.data.data.filter(
            (voucher: Voucher) => voucher.status === 'active'
          );
          if (availableVouchers.length === 0) {
            setVoucherError('No available vouchers found. Please create vouchers first.');
          }
          
          // Fetch product details for each voucher
          const vouchersWithProducts = await Promise.all(
            availableVouchers.map(async (voucher: Voucher) => {
              try {
                const productResponse = await api.get(`/products/${voucher.productId}`);
                if (productResponse.data.success) {
                  return {
                    ...voucher,
                    productName: productResponse.data.data.name
                  };
                }
                return voucher;
              } catch (error) {
                console.error(`Error fetching product for voucher ${voucher._id}:`, error);
                return voucher;
              }
            })
          );
          
          setVouchers(vouchersWithProducts);
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setVoucherError('Failed to load vouchers. Please try again.');
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchCustomers();
    fetchVouchers();
  }, []);

  // When voucher changes, update the amount based on the product price
  const selectedVoucherId = watch('voucherId');
  useEffect(() => {
    if (selectedVoucherId && !initialData) {
      const selectedVoucher = vouchers.find(v => v._id === selectedVoucherId);
      if (selectedVoucher && selectedVoucher.productId) {
        // Fetch product price
        const fetchProductPrice = async () => {
          try {
            const response = await api.get(`/products/${selectedVoucher.productId}`);
            if (response.data.success) {
              setValue('paymentDetails.amount', response.data.data.price);
            }
          } catch (error) {
            console.error('Error fetching product price:', error);
          }
        };
        fetchProductPrice();
      }
    }
  }, [selectedVoucherId, vouchers, setValue, initialData]);

  const handleFormSubmit = async (data: CreateOrderData) => {
    try {
      // Ensure amount is a number
      const formattedData = {
        ...data,
        paymentDetails: {
          ...data.paymentDetails,
          amount: Number(data.paymentDetails.amount)
        }
      };
      
      console.log('Submitting order data:', formattedData);
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        {initialData ? (
          <div className="mt-1">
            <input
              type="hidden"
              {...register('customerId')}
              value={initialData.customerId}
            />
            <div className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
              {loadingCustomers ? 'Loading customer information...' : 
                customers.find(c => c._id === initialData.customerId)?.name || 'Customer information not available'}
            </div>
            <p className="mt-1 text-xs text-gray-500">Customer cannot be changed when editing an order</p>
          </div>
        ) : (
          <select
            id="customerId"
            {...register('customerId', { required: 'Customer is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loadingCustomers}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        )}
        {errors.customerId && (
          <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
        )}
        {customerError && (
          <p className="mt-1 text-sm text-red-600">{customerError}</p>
        )}
        {loadingCustomers && !initialData && (
          <p className="mt-1 text-sm text-gray-500">Loading customers...</p>
        )}
      </div>

      {/* Voucher Selection */}
      <div>
        <label htmlFor="voucherId" className="block text-sm font-medium text-gray-700">
          Voucher
        </label>
        {initialData ? (
          <div className="mt-1">
            <input
              type="hidden"
              {...register('voucherId')}
              value={initialData.voucherId}
            />
            <div className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
              {loadingVouchers ? 'Loading voucher information...' : 
                vouchers.find(v => v._id === initialData.voucherId)?.code || 'Voucher information not available'}
            </div>
            <p className="mt-1 text-xs text-gray-500">Voucher cannot be changed when editing an order</p>
          </div>
        ) : (
          <select
            id="voucherId"
            {...register('voucherId', { required: 'Voucher is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loadingVouchers}
          >
            <option value="">Select a voucher</option>
            {vouchers.map((voucher) => (
              <option key={voucher._id} value={voucher._id}>
                {voucher.code} {voucher.productName ? `- ${voucher.productName}` : ''}
              </option>
            ))}
          </select>
        )}
        {errors.voucherId && (
          <p className="mt-1 text-sm text-red-600">{errors.voucherId.message}</p>
        )}
        {voucherError && (
          <p className="mt-1 text-sm text-red-600">{voucherError}</p>
        )}
        {loadingVouchers && !initialData && (
          <p className="mt-1 text-sm text-gray-500">Loading vouchers...</p>
        )}
      </div>

      {/* Payment Details Section */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        
        {/* Payment ID */}
        <div className="mb-4">
          <label htmlFor="paymentDetails.paymentId" className="block text-sm font-medium text-gray-700">
            Payment ID
          </label>
          <input
            type="text"
            id="paymentDetails.paymentId"
            {...register('paymentDetails.paymentId', { required: 'Payment ID is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.paymentDetails?.paymentId && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDetails.paymentId.message}</p>
          )}
        </div>

        {/* Payment Status */}
        <div className="mb-4">
          <label htmlFor="paymentDetails.paymentStatus" className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            id="paymentDetails.paymentStatus"
            {...register('paymentDetails.paymentStatus', { required: 'Payment status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          {errors.paymentDetails?.paymentStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDetails.paymentStatus.message}</p>
          )}
        </div>

        {/* Payment Email */}
        <div className="mb-4">
          <label htmlFor="paymentDetails.paymentEmail" className="block text-sm font-medium text-gray-700">
            Payment Email
          </label>
          <input
            type="email"
            id="paymentDetails.paymentEmail"
            {...register('paymentDetails.paymentEmail', { 
              required: 'Payment email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.paymentDetails?.paymentEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDetails.paymentEmail.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="paymentDetails.amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="paymentDetails.amount"
              step="0.01"
              min="0.01"
              {...register('paymentDetails.amount', { 
                required: 'Amount is required',
                min: {
                  value: 0.01,
                  message: 'Amount must be greater than 0'
                },
                validate: (value) => !isNaN(Number(value)) || 'Amount must be a number'
              })}
              className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {errors.paymentDetails?.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDetails.amount.message}</p>
          )}
        </div>

        {/* Payment Provider */}
        <div>
          <label htmlFor="paymentDetails.provider" className="block text-sm font-medium text-gray-700">
            Payment Provider
          </label>
          <select
            id="paymentDetails.provider"
            {...register('paymentDetails.provider', { required: 'Payment provider is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="mercadopago">MercadoPago</option>
          </select>
          {errors.paymentDetails?.provider && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentDetails.provider.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading || loadingCustomers || loadingVouchers}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Order'}
        </button>
      </div>
    </form>
  );
}; 
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Voucher, CreateVoucherData } from '@/hooks/useVouchers';
import api from '@/services/api';
import Image from 'next/image';

interface Store {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  storeId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface VoucherFormProps {
  initialData?: Voucher;
  onSubmit: (data: CreateVoucherData) => Promise<void>;
  onRedeem?: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
  initialData,
  onSubmit,
  onRedeem,
  isLoading
}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CreateVoucherData>({
    defaultValues: initialData ? {
      storeId: initialData.storeId,
      productId: initialData.productId,
      customerId: initialData.customerId || undefined,
      expirationDate: new Date(initialData.expirationDate).toISOString().split('T')[0],
      status: initialData.status
    } : {
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
      status: 'active'
    }
  });

  const selectedStoreId = watch('storeId');

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        setStoreError(null);
        const response = await api.get('/stores');
        if (response.data.success) {
          setStores(response.data.data);
          if (response.data.data.length === 0) {
            setStoreError('No stores found. Please create a store first.');
          }
        } else {
          setStoreError(response.data.error || 'Failed to load stores');
        }
      } catch (error: any) {
        console.error('Error fetching stores:', error);
        setStoreError(error.response?.data?.message || 'Failed to load stores');
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, []);

  // Fetch products based on selected store
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStoreId) {
        setProducts([]);
        return;
      }

      try {
        setLoadingProducts(true);
        setProductError(null);
        const response = await api.get(`/products?storeId=${selectedStoreId}`);
        if (response.data.success) {
          setProducts(response.data.data);
          if (response.data.data.length === 0) {
            setProductError(`No products found for the selected store. Please create a product first.`);
          }
        } else {
          setProductError(response.data.error || 'Failed to load products');
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setProductError(error.response?.data?.message || 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedStoreId]);

  // Fetch customers
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
          setCustomers(customerUsers);
          
          // If we have initialData with a customerId, find the customer
          if (initialData && initialData.customerId) {
            const customer = customerUsers.find((c: User) => c._id === initialData.customerId);
            if (customer) {
              setCurrentCustomer(customer);
            }
          }
          
          if (customerUsers.length === 0) {
            setCustomerError('No customers found. Vouchers can be created without assigning to a customer.');
          }
        } else {
          setCustomerError(response.data.error || 'Failed to load customers');
        }
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        setCustomerError(error.response?.data?.message || 'Failed to load customers');
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [initialData]);

  const handleFormSubmit = async (data: CreateVoucherData) => {
    try {
      console.log('Submitting voucher data:', data);
      await onSubmit(data);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleRedeem = async () => {
    if (initialData && onRedeem) {
      if (window.confirm('Are you sure you want to redeem this voucher?')) {
        await onRedeem(initialData._id);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* QR Code Display (only for editing) */}
      {initialData && initialData.qrCode && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Voucher QR Code</h3>
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white">
            <div className="mb-2">
              <img 
                src={initialData.qrCode} 
                alt={`QR Code for voucher ${initialData.code}`}
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-500 mb-1">Scan this QR code to access the redemption page</p>
            <p className="text-lg font-bold mt-2">{initialData.code}</p>
            
            <div className="mt-4 w-full max-w-md">
              <p className="text-sm font-medium text-gray-700 mb-1">Redemption Link:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/vouchers/redeem/${initialData.code}`}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/vouchers/redeem/${initialData.code}`);
                    alert('Redemption link copied to clipboard!');
                  }}
                  className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The QR code contains this link. Share it or let customers scan the QR code to redeem the voucher.
              </p>
            </div>
            
            {initialData.status === 'active' && onRedeem && (
              <button
                type="button"
                onClick={handleRedeem}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Redeem Voucher
              </button>
            )}
          </div>
        </div>
      )}

      {/* Store Selection */}
      <div>
        <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">
          Store
        </label>
        {initialData ? (
          <div className="mt-1">
            <input
              type="hidden"
              {...register('storeId')}
              value={initialData.storeId}
            />
            <div className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
              {loadingStores ? 'Loading store information...' : 
                stores.find(s => s._id === initialData.storeId)?.name || 'Store information not available'}
            </div>
            <p className="mt-1 text-xs text-gray-500">Store cannot be changed when editing a voucher</p>
          </div>
        ) : (
          <select
            id="storeId"
            {...register('storeId', { required: 'Store is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loadingStores || isLoading}
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>
        )}
        {errors.storeId && (
          <p className="mt-1 text-sm text-red-600">{errors.storeId.message}</p>
        )}
        {storeError && (
          <p className="mt-1 text-sm text-red-600">{storeError}</p>
        )}
        {loadingStores && !initialData && (
          <p className="mt-1 text-sm text-gray-500">Loading stores...</p>
        )}
      </div>

      {/* Product Selection */}
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
          Product
        </label>
        {initialData ? (
          <div className="mt-1">
            <input
              type="hidden"
              {...register('productId')}
              value={initialData.productId}
            />
            <div className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
              {loadingProducts ? 'Loading product information...' : 
                products.find(p => p._id === initialData.productId)?.name || 'Product information not available'}
            </div>
            <p className="mt-1 text-xs text-gray-500">Product cannot be changed when editing a voucher</p>
          </div>
        ) : (
          <select
            id="productId"
            {...register('productId', { required: 'Product is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loadingProducts || !selectedStoreId || isLoading}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        )}
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
        )}
        {productError && (
          <p className="mt-1 text-sm text-red-600">{productError}</p>
        )}
        {loadingProducts && !initialData && (
          <p className="mt-1 text-sm text-gray-500">Loading products...</p>
        )}
        {!selectedStoreId && !initialData && (
          <p className="mt-1 text-sm text-gray-500">Select a store to view available products</p>
        )}
      </div>

      {/* Customer Selection (Optional) */}
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
          Customer (Optional)
        </label>
        {initialData && initialData.customerId ? (
          <div className="mt-1">
            <input
              type="hidden"
              {...register('customerId')}
              value={initialData.customerId}
            />
            <div className="block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700">
              {loadingCustomers ? 'Loading customer information...' : 
                currentCustomer ? `${currentCustomer.name} (${currentCustomer.email})` : 'Customer information not available'}
            </div>
            <p className="mt-1 text-xs text-gray-500">Customer cannot be changed once assigned to a voucher</p>
          </div>
        ) : (
          <select
            id="customerId"
            {...register('customerId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={loadingCustomers || isLoading}
          >
            <option value="">No customer (voucher will be available for any customer)</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        )}
        {customerError && (
          <p className="mt-1 text-sm text-gray-500">{customerError}</p>
        )}
        {loadingCustomers && (
          <p className="mt-1 text-sm text-gray-500">Loading customers...</p>
        )}
      </div>

      {/* Expiration Date */}
      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
          Expiration Date
        </label>
        <input
          type="date"
          id="expirationDate"
          {...register('expirationDate', { required: 'Expiration date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min={new Date().toISOString().split('T')[0]} // Prevent past dates
        />
        {errors.expirationDate && (
          <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
        )}
      </div>

      {/* Status (only for editing) */}
      {initialData && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      )}

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
          disabled={isLoading || loadingStores || loadingProducts || loadingCustomers}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Voucher' : 'Create Voucher'}
        </button>
      </div>
    </form>
  );
}; 
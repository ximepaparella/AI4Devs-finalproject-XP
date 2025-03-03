import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Voucher, CreateVoucherData } from '@/hooks/useVouchers';
import api from '@/services/api';
import VoucherPreview from './VoucherPreview';

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
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateVoucherData>({
    defaultValues: initialData ? {
      storeId: initialData.storeId,
      productId: initialData.productId,
      customerId: initialData.customerId || undefined,
      expirationDate: initialData.expirationDate.split('T')[0],
      status: initialData.status,
      sender_name: initialData.sender_name,
      sender_email: initialData.sender_email,
      receiver_name: initialData.receiver_name,
      receiver_email: initialData.receiver_email,
      message: initialData.message,
      template: initialData.template
    } : {
      expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      template: 'template1'
    }
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(null);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialData?.template || 'template1');
  const [previewData, setPreviewData] = useState<Record<string, any>>({
    sender_name: initialData?.sender_name || '',
    sender_email: initialData?.sender_email || '',
    receiver_name: initialData?.receiver_name || '',
    receiver_email: initialData?.receiver_email || '',
    message: initialData?.message || '',
    productName: initialData?.productName || '',
    storeName: '',
    storeAddress: '123 Main St, City',
    storeEmail: 'store@example.com',
    storePhone: '(123) 456-7890',
    storeSocial: '@storename',
    storeLogo: '/logo.png',
    expirationDate: initialData?.expirationDate ? new Date(initialData.expirationDate).toLocaleDateString() : '',
    code: initialData?.code || 'XXXX-XXXX-XXXX',
    qrCode: initialData?.qrCode || '',
    template: initialData?.template || 'template1'
  });

  // Set up a single subscription to watch all form fields
  useEffect(() => {
    const subscription = watch((value) => {
      // Update basic form fields in preview data
      setPreviewData(prev => ({
        ...prev,
        sender_name: value.sender_name || '',
        sender_email: value.sender_email || '',
        receiver_name: value.receiver_name || '',
        receiver_email: value.receiver_email || '',
        message: value.message || '',
        template: value.template || 'template1',
        expirationDate: value.expirationDate ? new Date(value.expirationDate).toLocaleDateString() : ''
      }));
      
      // Update product name if product changes
      if (value.productId && products.length > 0) {
        const selectedProduct = products.find(p => p._id === value.productId);
        if (selectedProduct) {
          setPreviewData(prev => ({
            ...prev,
            productName: selectedProduct.name
          }));
        }
      }
      
      // Update store name if store changes
      if (value.storeId && stores.length > 0) {
        const selectedStore = stores.find(s => s._id === value.storeId);
        if (selectedStore) {
          setPreviewData(prev => ({
            ...prev,
            storeName: selectedStore.name
          }));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, products, stores]);

  const watchedStoreId = watch('storeId');

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const response = await api.get('/stores');
      if (response.data.success) {
        setStores(response.data.data);
        
        // If initialData has a storeId, make sure it's selected
        if (initialData && initialData.storeId) {
          setValue('storeId', initialData.storeId);
        }
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoadingStores(false);
    }
  };

  const fetchProducts = async () => {
    if (!watchedStoreId) {
      setProducts([]);
      return;
    }

    try {
      setLoadingProducts(true);
      const response = await api.get(`/products/store/${watchedStoreId}`);
      if (response.data.success) {
        setProducts(response.data.data);
        
        // If initialData has a productId and it belongs to the selected store, select it
        if (initialData && initialData.productId) {
          const productExists = response.data.data.some((product: Product) => product._id === initialData.productId);
          if (productExists) {
            setValue('productId', initialData.productId);
          } else {
            setValue('productId', '');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await api.get('/users?role=customer');
      if (response.data.success) {
        setCustomers(response.data.data);
        
        // If initialData has a customerId, make sure it's selected
        if (initialData && initialData.customerId) {
          setValue('customerId', initialData.customerId);
          
          // Find the current customer for display
          const customer = response.data.data.find((user: User) => user._id === initialData.customerId);
          if (customer) {
            setCurrentCustomer(customer);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log('Store ID changed:', watchedStoreId);
    fetchProducts();
  }, [watchedStoreId]);

  const handleFormSubmit = async (data: CreateVoucherData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleRedeem = async () => {
    if (initialData && onRedeem) {
      if (window.confirm('Are you sure you want to redeem this voucher?')) {
        await onRedeem(initialData._id);
      }
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
    setValue('template', e.target.value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">Store</label>
            <select
              id="storeId"
              {...register('storeId', { required: 'Store is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading || (!!initialData && !!initialData.storeId)}
            >
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
            {errors.storeId && <p className="mt-1 text-sm text-red-600">{errors.storeId.message}</p>}
            {loadingStores && <p className="mt-1 text-sm text-gray-500">Loading stores...</p>}
          </div>

          {/* Only show product selection on Create page, not on Edit page */}
          {!initialData && (
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                id="productId"
                {...register('productId', { required: 'Product is required' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={isLoading || !watchedStoreId || loadingProducts}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>{product.name} - ${product.price.toFixed(2)}</option>
                ))}
              </select>
              {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>}
              {loadingProducts && <p className="mt-1 text-sm text-gray-500">Loading products...</p>}
              {!watchedStoreId && <p className="mt-1 text-sm text-gray-500">Please select a store first</p>}
            </div>
          )}

          {/* If on Edit page, show the product name as read-only */}
          {initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                <p className="text-sm">{previewData.productName}</p>
                <input type="hidden" {...register('productId')} />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            {initialData && currentCustomer ? (
              <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                <p className="text-sm">{currentCustomer.name} ({currentCustomer.email})</p>
                <input type="hidden" {...register('customerId')} />
              </div>
            ) : (
              <select
                id="customerId"
                {...register('customerId')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={isLoading}
              >
                <option value="">Select a customer (optional)</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.name} ({customer.email})</option>
                ))}
              </select>
            )}
            {loadingCustomers && <p className="mt-1 text-sm text-gray-500">Loading customers...</p>}
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
            <input
              type="date"
              id="expirationDate"
              {...register('expirationDate', { required: 'Expiration date is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>}
          </div>

          <div>
            <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
            <input
              type="text"
              id="sender_name"
              {...register('sender_name', { required: 'Sender name is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.sender_name && <p className="mt-1 text-sm text-red-600">{errors.sender_name.message}</p>}
          </div>

          <div>
            <label htmlFor="sender_email" className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
            <input
              type="email"
              id="sender_email"
              {...register('sender_email', { 
                required: 'Sender email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.sender_email && <p className="mt-1 text-sm text-red-600">{errors.sender_email.message}</p>}
          </div>

          <div>
            <label htmlFor="receiver_name" className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
            <input
              type="text"
              id="receiver_name"
              {...register('receiver_name', { required: 'Receiver name is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.receiver_name && <p className="mt-1 text-sm text-red-600">{errors.receiver_name.message}</p>}
          </div>

          <div>
            <label htmlFor="receiver_email" className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
            <input
              type="email"
              id="receiver_email"
              {...register('receiver_email', { 
                required: 'Receiver email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.receiver_email && <p className="mt-1 text-sm text-red-600">{errors.receiver_email.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              {...register('message', { 
                required: 'Message is required',
                maxLength: {
                  value: 500,
                  message: 'Message cannot be more than 500 characters'
                }
              })}
              rows={4}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Template Design</label>
            <select
              id="template"
              {...register('template', { required: 'Template is required' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={isLoading}
              onChange={handleTemplateChange}
              value={selectedTemplate}
            >
              <option value="template1">Classic Design</option>
              <option value="template2">Modern Design</option>
              <option value="template3">Gradient Design</option>
              <option value="template4">Elegant Design</option>
              <option value="template5">Minimalist Design</option>
            </select>
            {errors.template && <p className="mt-1 text-sm text-red-600">{errors.template.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Voucher' : 'Create Voucher'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Use the new VoucherPreview component */}
        <VoucherPreview previewData={previewData} />

        {/* QR Code Display (only for editing) */}
        {initialData && initialData.qrCode && (
          <div className="mt-6">
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
      </div>
    </div>
  );
}; 
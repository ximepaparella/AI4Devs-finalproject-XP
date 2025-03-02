import api from './api';

// Interface for dashboard statistics
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  activeVouchers: number;
  redeemedVouchers: number;
  expiredVouchers?: number;
  totalVoucherUsages?: number;
}

// Interface for voucher data
export interface Voucher {
  id: string;
  code: string;
  productId: string;
  productName?: string;
  customerId: string;
  customerName?: string;
  storeId: string;
  storeName?: string;
  status: 'active' | 'redeemed' | 'expired';
  expirationDate: string;
  createdAt: string;
}

// Interface for dashboard data
export interface DashboardData {
  stats: DashboardStats;
  recentVouchers: Voucher[];
}

/**
 * Fetch dashboard data from the dedicated endpoint
 */
export const getDashboardData = async (limit = 5): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard data with limit:', limit);
    const response = await api.get(`/dashboard/stats?limit=${limit}`);
    
    console.log('Dashboard API response:', response.data);
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      
      return {
        stats: {
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          activeVouchers: data.activeVouchers || 0,
          redeemedVouchers: data.redeemedVouchers || 0,
          expiredVouchers: data.expiredVouchers || 0,
          totalVoucherUsages: data.totalVoucherUsages || 0,
        },
        recentVouchers: data.recentVouchers || []
      };
    }
    
    console.error('Invalid response format:', response.data);
    throw new Error('Failed to fetch dashboard data: Invalid response format');
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error.response || error);
    
    // Return default values
    return {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        activeVouchers: 0,
        redeemedVouchers: 0,
        expiredVouchers: 0,
        totalVoucherUsages: 0,
      },
      recentVouchers: []
    };
  }
};

/**
 * Fetch dashboard statistics (legacy method, use getDashboardData instead)
 * @deprecated Use getDashboardData instead
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // In a real application, you might have a dedicated endpoint for this
    // For now, we'll make separate requests and combine the data
    const [productsRes, ordersRes, vouchersRes] = await Promise.all([
      api.get('/products?limit=1'),
      api.get('/orders?limit=1'),
      api.get('/vouchers?limit=1'),
    ]);

    // Extract total counts from response headers or response data
    const totalProducts = productsRes.data.count || 0;
    const totalOrders = ordersRes.data.count || 0;
    
    // Count active and redeemed vouchers
    const allVouchers = vouchersRes.data.data || [];
    const activeVouchers = allVouchers.filter((v: Voucher) => v.status === 'active').length;
    const redeemedVouchers = allVouchers.filter((v: Voucher) => v.status === 'redeemed').length;

    return {
      totalProducts,
      totalOrders,
      activeVouchers,
      redeemedVouchers,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      activeVouchers: 0,
      redeemedVouchers: 0,
    };
  }
};

/**
 * Fetch recent vouchers (legacy method, use getDashboardData instead)
 * @deprecated Use getDashboardData instead
 */
export const getRecentVouchers = async (limit = 5): Promise<Voucher[]> => {
  try {
    const response = await api.get(`/vouchers?limit=${limit}&sort=-createdAt`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent vouchers:', error);
    return [];
  }
};

/**
 * Fetch vouchers by status
 */
export const getVouchersByStatus = async (status: 'active' | 'redeemed' | 'expired', limit = 10): Promise<Voucher[]> => {
  try {
    console.log(`Fetching ${status} vouchers with limit:`, limit);
    const response = await api.get(`/vouchers?status=${status}&limit=${limit}&sort=-createdAt`);
    
    console.log('Vouchers API response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data.data || [];
    }
    
    console.error('Invalid response format:', response.data);
    throw new Error('Failed to fetch vouchers: Invalid response format');
  } catch (error: any) {
    console.error(`Error fetching ${status} vouchers:`, error.response || error);
    return [];
  }
}; 
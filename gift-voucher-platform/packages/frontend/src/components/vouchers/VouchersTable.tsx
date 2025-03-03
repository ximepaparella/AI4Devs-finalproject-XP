import React from 'react';
import Link from 'next/link';
import { Voucher } from '@/hooks/useVouchers';

interface VouchersTableProps {
  vouchers: Voucher[];
  onDelete: (id: string) => Promise<void>;
  onRedeem?: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const VouchersTable: React.FC<VouchersTableProps> = ({
  vouchers,
  onDelete,
  onRedeem,
  isLoading
}) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      await onDelete(id);
    }
  };

  const handleRedeem = async (id: string) => {
    if (window.confirm('Are you sure you want to redeem this voucher?')) {
      if (onRedeem) {
        await onRedeem(id);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading vouchers...</span>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No vouchers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiration Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{voucher.code}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(voucher.status)}`}>
                  {voucher.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(voucher.expirationDate)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(voucher.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link 
                    href={`/vouchers/${voucher._id}`} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/vouchers/${voucher._id}/edit`} 
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(voucher._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                  {onRedeem && voucher.status === 'active' && (
                    <button
                      onClick={() => handleRedeem(voucher._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Redeem
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 
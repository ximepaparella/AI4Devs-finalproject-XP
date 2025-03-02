import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Link from 'next/link';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Determine if the user is an admin or store manager
  const isAdmin = session?.user?.role === 'admin';
  const isStoreManager = session?.user?.role === 'store_manager';
  const isCustomer = session?.user?.role === 'customer';

  // Update selected keys when the route changes
  useEffect(() => {
    const path = router.pathname;
    const pathSegments = path.split('/');
    
    if (pathSegments.length > 2) {
      setSelectedKeys([pathSegments[2]]);
    } else {
      setSelectedKeys(['dashboard']);
    }
  }, [router.pathname]);

  // Admin and Store Manager menu items
  const adminItems = [
    {
      key: 'dashboard',
      icon: 'icon',
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'vouchers',
      icon: 'icon',
      label: <Link href="/dashboard/vouchers">Vouchers</Link>,
    },
    {
      key: 'orders',
      icon: 'icon',
      label: <Link href="/dashboard/orders">Orders</Link>,
    },
    {
      key: 'users',
      icon: 'icon',
      label: <Link href="/dashboard/users">Users</Link>,
      // Only show to admins
      hidden: !isAdmin,
    },
    {
      key: 'stores',
      icon: 'icon',
      label: <Link href="/dashboard/stores">Stores</Link>,
      // Only show to admins
      hidden: !isAdmin,
    },
    {
      key: 'settings',
      icon: 'icon',
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  // Customer menu items
  const customerItems = [
    {
      key: 'dashboard',
      icon: 'icon',
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'my-vouchers',
      icon: 'icon',
      label: <Link href="/dashboard/my-vouchers">My Vouchers</Link>,
    },
    {
      key: 'purchase-history',
      icon: 'icon',
      label: <Link href="/dashboard/purchase-history">Purchase History</Link>,
    },
    {
      key: 'settings',
      icon: 'icon',
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  // Choose the appropriate menu items based on user role
  const menuItems = isCustomer ? customerItems : adminItems.filter(item => !item.hidden);

  return (
    <div className={`bg-white shadow-md ${collapsed ? 'w-16' : 'w-64'} transition-width duration-300`}>
      <div className="h-16 flex items-center justify-center">
        {!collapsed && (
          <div className="text-xl font-bold text-primary-600">
            {isAdmin ? 'Admin Panel' : isStoreManager ? 'Store Manager' : 'Customer Portal'}
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-2">
          {collapsed ? '>' : '<'}
        </button>
      </div>
      <div className="flex flex-col">
        {menuItems.map(item => (
          <Link key={item.key} href={item.label.props.href} className={`flex items-center p-2 ${selectedKeys.includes(item.key) ? 'bg-gray-200' : ''}`}>
            {item.icon}
            <span className={`ml-2 ${collapsed ? 'hidden' : 'block'}`}>{item.label.props.children}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 
import React, { useState, useEffect } from 'react';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  GiftOutlined,
  ShopOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons/lib';
import Link from 'next/link';

const { Sider } = Layout;

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
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'vouchers',
      icon: <GiftOutlined />,
      label: <Link href="/dashboard/vouchers">Vouchers</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link href="/dashboard/orders">Orders</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/dashboard/users">Users</Link>,
      // Only show to admins
      hidden: !isAdmin,
    },
    {
      key: 'stores',
      icon: <ShopOutlined />,
      label: <Link href="/dashboard/stores">Stores</Link>,
      // Only show to admins
      hidden: !isAdmin,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  // Customer menu items
  const customerItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'my-vouchers',
      icon: <GiftOutlined />,
      label: <Link href="/dashboard/my-vouchers">My Vouchers</Link>,
    },
    {
      key: 'purchase-history',
      icon: <HistoryOutlined />,
      label: <Link href="/dashboard/purchase-history">Purchase History</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  // Choose the appropriate menu items based on user role
  const menuItems = isCustomer ? customerItems : adminItems.filter(item => !item.hidden);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      className="bg-white shadow-md"
      breakpoint="lg"
    >
      <div className="h-16 flex items-center justify-center">
        {!collapsed && (
          <div className="text-xl font-bold text-primary-600">
            {isAdmin ? 'Admin Panel' : isStoreManager ? 'Store Manager' : 'Customer Portal'}
          </div>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        className="border-r-0"
      />
    </Sider>
  );
};

export default Sidebar; 
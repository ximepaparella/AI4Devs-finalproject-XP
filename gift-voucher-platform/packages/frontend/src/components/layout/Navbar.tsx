import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Avatar from 'antd/lib/avatar';
import Space from 'antd/lib/space';
import { useSession, signOut } from 'next-auth/react';
import { 
  UserOutlined, 
  LogoutOutlined, 
  DashboardOutlined,
  MenuOutlined,
  GiftOutlined
} from '@ant-design/icons/lib';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      label: (
        <Link href="/dashboard" className="flex items-center">
          <DashboardOutlined className="mr-2" /> Dashboard
        </Link>
      ),
    },
    {
      key: 'signout',
      label: (
        <a onClick={handleSignOut} className="flex items-center text-red-500">
          <LogoutOutlined className="mr-2" /> Sign Out
        </a>
      ),
    },
  ];

  return (
    <Header className="bg-white shadow-md px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <GiftOutlined className="text-2xl text-primary-600 mr-2" />
          <span className="text-xl font-bold text-primary-600">Gifty</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/" className={`px-3 py-2 rounded-md ${isActive('/') ? 'text-primary-600' : 'hover:text-primary-500'}`}>
          Home
        </Link>
        
        {!session ? (
          <>
            <Link href="/login" className={`px-3 py-2 rounded-md ${isActive('/login') ? 'text-primary-600' : 'hover:text-primary-500'}`}>
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span>{session.user?.name}</span>
            </Space>
          </Dropdown>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        {mobileMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white shadow-md z-50 p-4">
            <Menu mode="vertical">
              <Menu.Item key="home">
                <Link href="/">Home</Link>
              </Menu.Item>
              
              {!session ? (
                <>
                  <Menu.Item key="login">
                    <Link href="/login">Login</Link>
                  </Menu.Item>
                  <Menu.Item key="register">
                    <Link href="/register">Sign Up</Link>
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item key="dashboard">
                    <Link href="/dashboard">Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key="signout" danger onClick={handleSignOut}>
                    Sign Out
                  </Menu.Item>
                </>
              )}
            </Menu>
          </div>
        )}
      </div>
    </Header>
  );
};

export default Navbar; 
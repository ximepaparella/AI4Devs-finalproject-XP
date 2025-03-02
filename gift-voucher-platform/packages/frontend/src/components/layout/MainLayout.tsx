import React, { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Gifty - Gift Voucher Platform',
  description = 'Buy and manage gift vouchers for your favorite stores',
  showSidebar = false,
}) => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        
        <Layout>
          {showSidebar && isAuthenticated && <Sidebar />}
          
          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
            <div className="container mx-auto">
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout; 
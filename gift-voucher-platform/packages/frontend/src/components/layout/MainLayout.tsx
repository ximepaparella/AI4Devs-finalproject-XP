import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';

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

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex flex-1">
          {showSidebar && isAuthenticated && <Sidebar />}
          
          <main className="flex-1 p-6 min-h-[calc(100vh-64px)]">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
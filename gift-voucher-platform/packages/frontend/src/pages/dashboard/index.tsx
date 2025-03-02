import React from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - Gifty</title>
        <meta name="description" content="Manage your gift vouchers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center">
          Dashboard
        </h1>
        <p className="mt-4 text-xl text-center text-gray-600">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </main>
    </div>
  );
} 
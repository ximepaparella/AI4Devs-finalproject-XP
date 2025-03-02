import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Gifty - Gift Voucher Platform</title>
        <meta name="description" content="Buy and manage gift vouchers with Gifty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Gifty - Gift Voucher Platform
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <Card title="About Gifty">
            <p className="text-lg text-gray-700">
              Gifty is a platform for buying, managing, and redeeming gift vouchers from your favorite stores.
              Our simplified interface makes it easy to purchase and track your vouchers.
            </p>
          </Card>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/login" className="flex-1">
              <div className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-md transition-colors">
                Sign In
              </div>
            </Link>
            <Link href="/register" className="flex-1">
              <div className="bg-gray-800 hover:bg-gray-900 text-white text-center py-3 px-4 rounded-md transition-colors">
                Create Account
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
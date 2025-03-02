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
      
      </main>
    </div>
  );
}
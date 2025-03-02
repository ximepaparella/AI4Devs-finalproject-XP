import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-md px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <svg className="w-6 h-6 text-primary-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12v-2h-3V7h3V5l4 3.5-4 3.5zm-8-2V5l-4 3.5L12 12v-2h3V7h-3zm1 6v2h-3v3h3v2l4-3.5-4-3.5zm-9 2v-2H1v-3h3V8L0 11.5 4 15z"/>
          </svg>
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
            <Link href="/register" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span>{session.user?.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {mobileMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white shadow-md z-50 p-4">
            <div className="space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Home
              </Link>
              
              {!session ? (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                    Login
                  </Link>
                  <Link href="/register" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
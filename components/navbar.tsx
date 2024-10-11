"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Link as LinkIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <Link 
    href={href} 
    className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LinkIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">URLShort</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shorten">Shorten URL</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-blue-500 focus:outline-none focus:text-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <button
            onClick={closeSidebar}
            className="text-gray-600 hover:text-blue-500 focus:outline-none focus:text-blue-500"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="mt-8 flex flex-col space-y-4">
            <NavLink href="/" onClick={closeSidebar}>Home</NavLink>
            <NavLink href="/shorten" onClick={closeSidebar}>Shorten URL</NavLink>
            <NavLink href="/about" onClick={closeSidebar}>About</NavLink>
            <NavLink href="/contact" onClick={closeSidebar}>Contact</NavLink>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
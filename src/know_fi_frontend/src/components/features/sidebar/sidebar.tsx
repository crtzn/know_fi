'use client';

import { Album, BarChart3, ChevronLeft, LayoutDashboard, LogOut, Menu, TrendingUp, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import know_fi_logo from '@/components/common/icons/know_fi_logo.png';

const dashboardItems = [
  {
    title: 'MENU',
    items: [
      { id: 0, icon: User, label: 'Profile', href: '/profile' },
      { id: 1, icon: LayoutDashboard, label: 'Dashboard', href: '/' },
      { id: 2, icon: BarChart3, label: 'Analytics', href: '/analytics' },
      { id: 3, icon: TrendingUp, label: 'Marketplace', href: '/marketplace' },
      { id: 4, icon: Album, label: 'Courses', href: '/courses' },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside className="relative">
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="duration-400 fixed left-4 top-4 z-50 rounded-lg bg-slate-900 p-2 text-white shadow-lg transition-colors hover:bg-slate-800 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className=".z-50 fixed inset-0 z-30 bg-black transition-opacity duration-300 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`duration-400 fixed left-0 top-0 z-40 h-full border-r-2 border-slate-700 transition-all ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-60'} w-60 shadow-2xl`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-[10%] items-center justify-between border-b-2 border-slate-700 p-4">
            <Link href={'/'} className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-lg">
                <Image src={know_fi_logo} alt="Logo" width={36} height={36} unoptimized />
              </div>
              {!isCollapsed && (
                <h1 className="text-xl font-bold tracking-wide text-[#65009F] transition-colors duration-200">
                  KnowFi
                </h1>
              )}
            </Link>

            {/* Desktop Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="duration-400 hidden items-center justify-center rounded-lg p-1 text-slate-400 transition-colors hover:text-black lg:block"
            >
              <ChevronLeft
                size={20}
                className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-2">
            {dashboardItems.map((section) => (
              <div key={section.title} className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`duration-400 group flex w-full items-center rounded-lg px-4 py-3 transition-all ${
                        isCollapsed ? 'justify-center' : 'space-x-3'
                      } ${
                        isActive ? 'bg-[#65009F] text-white shadow-lg' : 'text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-black group-hover:text-white'
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium transition-colors duration-200">{item.label}</span>
                          {isActive && <div className="ml-auto size-2 rounded-full bg-white opacity-80" />}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t-2 border-slate-700 p-2">
              <Link
                href={'/'}
                className="flex items-center justify-center gap-2 rounded-lg p-2 text-black hover:bg-black hover:text-white"
              >
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

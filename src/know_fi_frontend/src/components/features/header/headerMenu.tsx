'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import know_fi_logo from '@/components/common/icons/know_fi_logo.png';
import sampleNft from '@/components/common/icons/sampleNft.png';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

function Header1() {
  const pathname = usePathname();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
    },
    {
      title: 'Leaderboard',
      href: '/leaderboard',
    },
    {
      title: 'Marketplace',
      href: '/marketplace',
    },
    {
      title: 'Course',
      href: '/courses',
    },
    {
      title: 'Quest',
      href: '/quest',
      description: '',
    },
    {
      title: 'Community',
      href: '/forum',
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b-2 border-black bg-[#E0C2FF] shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <div className="container relative mx-auto flex min-h-16 flex-row items-center gap-3">
        <Link href={'/'}>
          <Image src={know_fi_logo} alt="Logo" width={48} height={48} unoptimized className="size-auto" />
        </Link>
        <div className="hidden flex-row items-center justify-start gap-3 lg:flex">
          <NavigationMenu className={`flex items-start justify-start`}>
            <NavigationMenuList className="flex flex-row justify-start gap-4 text-xl font-bold">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={`rounded px-4 py-2 ${
                          isActive
                            ? 'bg-[#65009F] text-white shadow-lg'
                            : 'text-black hover:bg-purple-500 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* <div className="flex lg:justify-center">
          <p className="font-semibold">TWBlocks</p>
        </div> */}
        <div className="flex w-full items-center justify-end gap-4">
          <Button className="rounded-xl border-[3px] border-black bg-orange-500 text-lg font-bold text-black hover:bg-[#65009F] hover:text-white">
            Join
          </Button>
          <Link href={'/profile'}>
            <Image
              src={sampleNft}
              alt="Logo"
              width={50}
              height={50}
              unoptimized
              className="rounded-full border-[3px] border-black"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export { Header1 };

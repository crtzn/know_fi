import { Album, ChartColumnBig, CircleUserRound, ClipboardList, House, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const dashboardItems = [
  {
    title: 'MENU',
    items: [
      {
        id: 0,
        icon: <CircleUserRound width={32} height={32} />,
        label: 'Profile',
        href: '/profile',
      },
      {
        id: 1,
        icon: <House width={32} height={32} />,
        label: 'Dashboard',
        href: '/',
      },
      {
        id: 2,
        icon: <ChartColumnBig width={32} height={32} />,
        label: 'Analyitcs',
        href: '/analytics',
      },
      {
        id: 3,
        icon: <TrendingUp width={32} height={32} />,
        label: 'Marketplace',
        href: '/marketplace',
      },
      {
        id: 4,
        icon: <Album width={32} height={32} />,
        label: 'Courses',
        href: '/courses',
      },
      {
        id: 5,
        icon: <ClipboardList width={32} height={32} />,
        label: 'Quiz',
        href: '/quiz',
      },
    ],
  },
];

function Menu() {
  return (
    <div>
      <div>
        {/* Top part/Logo */}
        <Link href="/" className="flex items-center justify-center md:justify-start xl:justify-center gap-2 p-4 mb-6">
          <House width={90} height={56.5} className="border" />
        </Link>
      </div>

      <div className="p-4">
        {/* Menu list */}
        {dashboardItems.map((i) => (
          <div className="flex flex-col gap-5" key={i.title}>
            {i.items.map((items) => (
              <Link
                key={items.id}
                href={items.href}
                className="flex items-center justify-center lg:justify-start gap-4 text-black py-2"
              >
                <div>{items.icon}</div>
                <span className="hidden lg:block text-xl font-bold">{items.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;

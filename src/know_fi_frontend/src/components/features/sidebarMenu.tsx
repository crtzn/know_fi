import { Album, ChartColumnBig, CircleUserRound, ClipboardList, House, Plus, TrendingUp } from 'lucide-react';
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
        icon: <Plus width={32} height={32} />,
        label: 'Contribute Course',
        href: '/course-contribution',
      },
      {
        id: 6,
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
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 p-4 md:justify-start xl:justify-center">
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
                className="flex items-center justify-center gap-4 py-2 text-black lg:justify-start"
              >
                <div>{items.icon}</div>
                <span className="hidden text-xl font-bold lg:block">{items.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;

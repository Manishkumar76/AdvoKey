import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarItems } from './sideBar-items';
import Image from 'next/image';
import logo from '../../assets/images/Logo.png';

const Sidebar = () => {
  const pathname = usePathname();


  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
      <div className="p-4 text-2xl font-bold text-blue-900">AdvoKey Admin</div>
      <nav className="mt-4">
        {sidebarItems.map(({ name, href, icon: Icon }) => (
          <Link key={name} href={href}>
            <div className={`flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md cursor-pointer ${
              pathname === href ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
            }`}>
              <Icon size={20} />
              {name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

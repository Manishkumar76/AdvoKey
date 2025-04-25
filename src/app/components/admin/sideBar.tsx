import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarItems } from './sideBar-items';
import Image from 'next/image';
import logo from '../../assets/images/Logo.png';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 top-20 bg-gray-300 shadow-md min-h-screen rounded-tr-2xl">
      <div className="p-4 text-xl font-bold  text-blue-700"> 
        <Image src={logo} alt="Logo" width={100} height={100} className="inline-block mr-2" />
       </div>
      <nav className="flex flex-col p-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-2 rounded-md mb-1 ${pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

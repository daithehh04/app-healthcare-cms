"use client"
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { menu } from "../utils/menuData";
export default function SideBar() {
     const pathname = usePathname();
     const isCoursePage = pathname.includes("/courses/");
     return (
          <aside className={`transition-transform transform flex-shrink-0 ${isCoursePage ? 'fixed -translate-x-full' : ' translate-x-0'} `}>
               <div className='w-[96px] sticky top-[74px] left-0 px-2 z-10' >
                    <ul className='mt-4'>
                         {
                              menu.map(({ title, icon, path }, index) => <li key={index}>
                                   <Link
                                        className={`flex items-center flex-col w-[72px] h-[72px] justify-center mt-1 rounded-2xl cursor-pointer ${pathname === path ? 'bg-[#e8ebed]' : ''}`}
                                        href={path}>
                                        {icon}
                                        <span className='text-[11px] text-[#404040] mt-2 font-semibold'>{title}</span>
                                   </Link>
                              </li>)
                         }
                    </ul>
               </div>

          </aside>
     )
}

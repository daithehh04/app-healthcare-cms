"use client"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Action() {
     const router = useRouter();

     const handleLogout = () => {
          // Clear the login cookies
          Cookies.remove('login');

          // Redirect to the login page
          router.push('/auth/login');
     };

     return (
          <div className="flex gap-3 items-center">
               <Dropdown>
                    <DropdownTrigger>
                         <Avatar showFallback src='https://images.unsplash.com/broken' />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                         <DropdownItem key="info">Xem thông tin cá nhân</DropdownItem>
                         <DropdownItem key="setting">Cài đặt</DropdownItem>
                         <DropdownItem key="logout" onClick={handleLogout}>Đăng Xuất</DropdownItem>
                    </DropdownMenu>
               </Dropdown>
          </div>
     )
}

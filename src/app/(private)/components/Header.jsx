import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import Search from "./Search";
import Action from "./Action";
export default function Header() {
     return (
          <div className='h-[66px] flex justify-between bg-[#fff] items-center px-7 border-b-[1px] border-solid border-[#e8ebed] sticky top-0 right-0 z-20'>
               <div>
                    <Link
                         className='flex gap-2 items-center'
                         href='/'

                    >
                         <Image
                              className='rounded-lg'
                              src="http://res.cloudinary.com/daxftrleb/image/upload/v1719845288/heathcare/rypnkqgnfai8h0lfoosl.png"
                              width={40}
                              height={40}
                              alt="logo"
                         />
                         <h2 className={clsx("text-[#242424] font-black text-l", 'logo')}>Life care 24h</h2>
                    </Link>

               </div>
               <Search />
               <Action />

          </div>
     )
}

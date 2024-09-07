import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
export default function Search() {
     return (
          <div>
               <label
                    className='group flex items-center gap-4 justify-center h-[40px] w-[420px] pr-4 pl-2 border-2 border-[#e8ebed] border-solid rounded-[20px]'
                    htmlFor='search'>
                    <IoSearchOutline className='text-[22px] text-[#7c7c7c]' />
                    <input className='block h-full flex-grow' type="text" id='search' name='search' placeholder='Tìm kiếm bác sĩ ,thuốc , đặt lịch ...' />
               </label>

          </div>
     )
}

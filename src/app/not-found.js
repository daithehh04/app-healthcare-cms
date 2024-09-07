import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
     return (
          <div className='p-4'>
               <div className="mb-8 h-[20wh]">
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
                         <h2 className="text-[#242424] font-black text-xl logo">life care 24h</h2>
                    </Link>
               </div>
               <div className="flex flex-col justify-between h-[80vh]">
                    <div>
                         <h2
                              className="
                              block
                              w-full
                              bg-[50%]
                              h-[200px]
                              bg-cover
                              bg-[url('http://res.cloudinary.com/daxftrleb/image/upload/v1709888289/e-learning/aeka15gelasxepcykit0.jpg')]
                              bg-no-repeat
                              bg-clip-text
                              text-[transparent]
                              text-center
                              font-black
                              text-[200px]
                              "
                         >
                              404
                         </h2>
                         <h1 className="text-[45px] font-black text-center mt-10">Không tìm thấy nội dung 😓</h1>
                         <ul className="mt-12">
                              <li className="pb-3 text-center font-medium">URL của nội dung này đã <strong>bị thay đổi</strong> hoặc <strong>không còn tồn tại</strong>.</li>
                              <li className="pb-3 text-center font-medium">Nếu bạn <strong>đang lưu URL này</strong>, hãy thử <strong>truy cập lại từ trang chủ</strong> thay vì dùng URL đã lưu.</li>
                         </ul>
                         <div className="flex items-center justify-center my-9">
                              <Link
                                   className="bg-[#a40750] text-[#fff] py-3 px-7 rounded-[9999px]"
                                   href='/'>
                                   Truy cập vào trang chủ
                              </Link>
                         </div>
                    </div>
                    <div className="text-[#666] font-bold text-center text-[14px]">Đội ngũ phát triển sinh viên kma</div>
               </div>

          </div>
     )
}

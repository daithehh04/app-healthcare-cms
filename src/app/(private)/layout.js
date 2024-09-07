import React from 'react'
import Header from './components/Header'
import SideBar from './components/SideBar'
import Footer from './components/Footer'


export default function PrivateLayout({ children }) {
     return (
          <>
               <Header />
               <main className='flex min-h-[100vh]'>
                    <SideBar />
                    <div className='pt-3 pr-10 pl-5 flex-1'>

                         {
                              children
                         }
                    </div>
               </main>

               <Footer />
          </>
     )
}

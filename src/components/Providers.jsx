'use client';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { authSliceApi } from '@/stores/slices/api/auth.slices.api';

export default function Providers({ children, themeProps }) {
     const router = useRouter();

     return (
          <ApiProvider api={authSliceApi} >
               <NextUIProvider navigate={router.push}>
                    <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
               </NextUIProvider>
          </ApiProvider>
     );
}

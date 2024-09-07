import ProviderRedux from '@/stores/Providers';
import { Toaster } from 'sonner';
import getMetadata from '@/configs/site.config';
import Providers from "../components/Providers";
import { fontSans } from '@/configs/font.config';
import '@/styles/globals.scss';
import { clsx } from "clsx";
export async function generateMetadata() {
  const metadata = getMetadata('Trang chủ');
  return metadata;
}
export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${clsx('body', fontSans.className)} bg-color-50`}>
        <Providers themeProps={{ defaultTheme: 'green' }} >
          <ProviderRedux>{children}</ProviderRedux>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}

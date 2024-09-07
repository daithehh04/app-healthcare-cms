/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     env: {
          HOST_URL: process.env.HOST_URL || 'http://localhost:3000/v1/api/',
          SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000/v1/api/',
          FILE_URL: process.env.FILE_URL || 'http://localhost:3000/v1/api/'
     },
     images: {
          remotePatterns: [
               {
                    hostname: 'res.cloudinary.com',
               },
          ],
     },
};

export default nextConfig;

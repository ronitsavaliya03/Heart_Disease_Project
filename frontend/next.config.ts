/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        // REPLACE THIS URL with your actual Render URL
        destination: 'https://cardio-backend-so0r.onrender.com/api/:path*', 
      },
    ];
  },
};

export default nextConfig;

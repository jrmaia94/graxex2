/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
        remotePatterns: [
            {
                hostname: "picsum.photos",
            },
            {
                hostname: "example.com",
            }
        ]
    }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // <=== enables static exports
    reactStrictMode: true,
    basePath: "/lambda-calculus-playground",
}

export default nextConfig

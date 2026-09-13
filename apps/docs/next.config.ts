import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
    output: 'export',
    reactStrictMode: true,
    trailingSlash: true,
    outputFileTracingRoot: path.resolve(__dirname, '../../'),
}

export default nextConfig

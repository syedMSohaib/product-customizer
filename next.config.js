/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['fabric'],
    },
    webpack: (config) => {
        config.externals.push({
            sharp: 'commonjs sharp',
            canvas: 'commonjs canvas',
        });
        return config;
    },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
module.exports = {
    webpack: (config) => {
        config.externals.push({
            sharp: 'commonjs sharp',
            canvas: 'commonjs canvas',
            // bufferutil: "bufferutil",
            // "utf-8-validate": "utf-8-validate",
            // "supports-color": "supports-color"
        });
        return config;
    }
};
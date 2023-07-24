// /**
//  * Due to Iterative Static Regeneration and the dynamic loading you can get with Vercel in general, 
//  * you need to set LD_LIBRARY_PATH properly for all instances of the Vercel processes that are spawned, 
//  * not just the initial buildscript.
//  * 
//  * https://github.com/Automattic/node-canvas/issues/1779
//  */


// if (
//     process.env.LD_LIBRARY_PATH == null ||
//     !process.env.LD_LIBRARY_PATH.includes(
//         `${process.env.PWD}/node_modules/canvas/build/Release:`,
//     )
// ) {
//     process.env.LD_LIBRARY_PATH = `${
//       process.env.PWD
//     }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

module.exports = {
    ...nextConfig,
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
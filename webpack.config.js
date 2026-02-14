const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/index.ts',               // main TypeScript entry
  target: 'node',                        // target Node.js
  mode: 'production',                    // optimize for production
  devtool: false,                        // disable source maps for smaller output
  module: {
    rules: [
      {
        test: /\.ts$/,                   // process TypeScript files
        use: 'ts-loader',                // handle TypeScript
        exclude: /node_modules/,         // exclude node_modules
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],          // resolve both .ts and .js files
  },
  output: {
    filename: 'index.js',                // output filename
    path: path.resolve(__dirname, 'dist'), // output directory
    clean: true,                         // clean up previous output before new build
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',                 // use gzip for compression
      test: /\.js$/,                     // compress only .js files
      threshold: 8192,                   // compress files larger than 8 KB
      minRatio: 0.8,                     // only compress files with this compression ratio
    }),
  ],
};
